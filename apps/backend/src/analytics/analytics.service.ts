import type { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import type { BlockEventKind } from "./block-event.entity";
import type { StatsQueryDto } from "./dto/block-event.dto";
import type { SourceColumns } from "./source";
import type {
  BlockClicks,
  LinkStats,
  OverviewStats,
  SourceLabel,
  StatsPoint,
  StatsSource,
  StatsTotals,
} from "./stats";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SlidingWindow } from "../common/sliding-window";
import { BlockEvent } from "./block-event.entity";
import { PageView } from "./page-view.entity";
import { classifySource } from "./stats";

/** What a visitor is told when one of the two windows refuses an event. */
const refusedEvent = {
  key: "Too many events for this block. Try again in a minute.",
  scope: "Too many events on this page. Try again in a minute.",
};

/** A reload is the visitor's own doing, and the two view windows say so rather than blaming the page. */
const refusedView = {
  key: "This page counted a visit from you a moment ago. Try again in a minute.",
  scope: "Too many visits to this page. Try again in a minute.",
};

/**
 * Which pages a read covers: one page's own screen asks about one, the home dashboard about all of the
 * owner's. Every aggregate takes this instead of a link id, so the two endpoints share one set of queries
 * rather than each owning a copy.
 */
type Scope = { linkId: string } | { ids: string[] };

/** One grouped row of stored source facts, before a label is derived from it. */
interface SourceGroup {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrerHost: string | null;
  referrerInternal: boolean | number;
  views?: number;
  visitors?: number;
  clicks?: number;
}

/** One page's row in a set of per-page totals; a page with no events has no row. */
interface LinkGroup {
  linkId: string;
  views?: number;
  visitors?: number;
  clicks?: number;
}

const emptyTotals = (): StatsTotals => ({ views: 0, visitors: 0, clicks: 0 });

@Injectable()
export class AnalyticsService {
  /**
   * A block takes 60 events a minute and a page takes 300 across all its blocks: without the second
   * ceiling a page with ten blocks would accept ten times the stream, and nothing prunes that table yet.
   */
  private readonly window = new SlidingWindow({ perKey: 60, perScope: 300 });

  /**
   * Views get their own window, so neither kind of event can spend the other's budget and a busy page's
   * clicks never silence its visits. A page load is one event, so the per-key limit is a reload guard —
   * keyed by the visitor's rotating hash, the one place a window is not keyed by content — and the page
   * ceiling is what bounds a page's traffic.
   */
  private readonly viewWindow = new SlidingWindow({ perKey: 10, perScope: 300 });

  constructor(
    @InjectRepository(BlockEvent) private readonly events: Repository<BlockEvent>,
    @InjectRepository(PageView) private readonly views: Repository<PageView>,
  ) {}

  /**
   * Stores one page load, or refuses before touching the table: a rejected request must leave no row behind,
   * or the window would not be the only thing it changed.
   */
  async recordView(linkId: string, visitorHash: string, source: SourceColumns) {
    this.viewWindow.admit(linkId, visitorHash, refusedView);

    await this.views.save(this.views.create({ linkId, visitorHash, ...source }));
  }

  /** Stores an accepted event, or refuses before touching the table for the same reason a view is refused. */
  async record(linkId: string, blockId: string, kind: BlockEventKind, visitorHash: string, source: SourceColumns) {
    this.window.admit(linkId, `${linkId}:${blockId}`, refusedEvent);

    await this.events.save(this.events.create({ linkId, blockId, kind, visitorHash, ...source }));
  }

  /**
   * One page's traffic — totals, a daily series, its sources and its blocks. Every number comes from a
   * grouped scan, so a block or a source with no rows simply has no row.
   *
   * Visitors count views only. A person who opened the page and clicked a block is one visitor and one
   * click, not two of either.
   */
  async linkStats(linkId: string, range: StatsQueryDto): Promise<LinkStats> {
    const scope = { linkId };
    const [views, clicks, viewDays, clickDays, viewSources, clickSources, blocks] = await Promise.all([
      this.viewTotals(scope, range),
      this.clickTotals(scope, range),
      this.viewDays(scope, range),
      this.clickDays(scope, range),
      this.viewSources(scope, range),
      this.clickSources(scope, range),
      this.blockClicks(scope, range),
    ]);

    return {
      totals: this.totalOf(views, clicks),
      timeseries: this.mergeSeries(viewDays, clickDays),
      sources: this.mergeSources(viewSources, clickSources),
      blocks,
    };
  }

  /**
   * The owner's whole portfolio. It starts from the pages, not from the events: a page nobody opened is a
   * row of zeros, because "this page got nothing" is the thing the owner needs to see.
   */
  async overview(
    links: { id: string; slug: string; title: string }[],
    range: StatsQueryDto,
  ): Promise<OverviewStats> {
    /* An empty `IN ()` is not valid SQL, and an owner with no pages has nothing to aggregate anyway. */
    if (!links.length) return { totals: emptyTotals(), timeseries: [], sources: [], links: [] };

    const scope = { ids: links.map((link) => link.id) };
    const [views, clicks, viewDays, clickDays, viewSources, clickSources] = await Promise.all([
      this.viewTotals(scope, range),
      this.clickTotals(scope, range),
      this.viewDays(scope, range),
      this.clickDays(scope, range),
      this.viewSources(scope, range),
      this.clickSources(scope, range),
    ]);

    const perLink = new Map<string, StatsTotals>();
    for (const row of [...views, ...clicks]) {
      const totals = perLink.get(row.linkId) ?? emptyTotals();

      totals.views += Number(row.views ?? 0);
      totals.visitors += Number(row.visitors ?? 0);
      totals.clicks += Number(row.clicks ?? 0);
      perLink.set(row.linkId, totals);
    }

    return {
      totals: this.totalOf(views, clicks),
      timeseries: this.mergeSeries(viewDays, clickDays),
      sources: this.mergeSources(viewSources, clickSources),
      links: links.map((link) => ({
        id: link.id,
        slug: link.slug,
        title: link.title,
        ...(perLink.get(link.id) ?? emptyTotals()),
      })),
    };
  }

  /** Every row of the two per-page scans adds up to one number each. */
  private totalOf(views: LinkGroup[], clicks: LinkGroup[]): StatsTotals {
    return {
      views: views.reduce((sum, row) => sum + Number(row.views ?? 0), 0),
      visitors: views.reduce((sum, row) => sum + Number(row.visitors ?? 0), 0),
      clicks: clicks.reduce((sum, row) => sum + Number(row.clicks ?? 0), 0),
    };
  }

  /** Views per page, with the distinct visitors behind them. */
  private viewTotals(scope: Scope, range: StatsQueryDto): Promise<LinkGroup[]> {
    const query = this.scoped("v", scope, this.views.createQueryBuilder("v"))
      .select("v.linkId", "linkId")
      .addSelect("COUNT(*)", "views")
      .addSelect("COUNT(DISTINCT v.visitorHash)", "visitors")
      .groupBy("v.linkId");

    return this.inRange(query, "v", range).getRawMany<LinkGroup>();
  }

  private clickTotals(scope: Scope, range: StatsQueryDto): Promise<LinkGroup[]> {
    const query = this.scoped("e", scope, this.events.createQueryBuilder("e"))
      .select("e.linkId", "linkId")
      .addSelect("COUNT(*)", "clicks")
      .andWhere("e.kind = :kind", { kind: "click" })
      .groupBy("e.linkId");

    return this.inRange(query, "e", range).getRawMany<LinkGroup>();
  }

  private viewDays(scope: Scope, range: StatsQueryDto): Promise<Partial<StatsPoint>[]> {
    const query = this.scoped("v", scope, this.views.createQueryBuilder("v"))
      .select("date(v.createdAt)", "date")
      .addSelect("COUNT(*)", "views")
      /* Distinct within the day, which is the day the salt rotates on: the series' visitors add up. */
      .addSelect("COUNT(DISTINCT v.visitorHash)", "visitors")
      .groupBy("date(v.createdAt)");

    return this.inRange(query, "v", range).getRawMany<Partial<StatsPoint>>();
  }

  private clickDays(scope: Scope, range: StatsQueryDto): Promise<Partial<StatsPoint>[]> {
    const query = this.scoped("e", scope, this.events.createQueryBuilder("e"))
      .select("date(e.createdAt)", "date")
      .addSelect("COUNT(*)", "clicks")
      .andWhere("e.kind = :kind", { kind: "click" })
      .groupBy("date(e.createdAt)");

    return this.inRange(query, "e", range).getRawMany<Partial<StatsPoint>>();
  }

  /**
   * Views grouped by the raw source facts rather than by the label the dashboard prints: the label is
   * derived in memory, so no SQL has to know what a search engine is.
   */
  private viewSources(scope: Scope, range: StatsQueryDto): Promise<SourceGroup[]> {
    const query = this.scoped("v", scope, this.views.createQueryBuilder("v"))
      .select("v.utmSource", "utmSource")
      .addSelect("v.utmMedium", "utmMedium")
      .addSelect("v.utmCampaign", "utmCampaign")
      .addSelect("v.referrerHost", "referrerHost")
      .addSelect("v.referrerInternal", "referrerInternal")
      .addSelect("COUNT(*)", "views")
      .addSelect("COUNT(DISTINCT v.visitorHash)", "visitors")
      .groupBy("v.utmSource")
      .addGroupBy("v.utmMedium")
      .addGroupBy("v.utmCampaign")
      .addGroupBy("v.referrerHost")
      .addGroupBy("v.referrerInternal");

    return this.inRange(query, "v", range).getRawMany<SourceGroup>();
  }

  /** The same breakdown for clicks. No visitor count: visitors are a view metric, clickers are clicks. */
  private clickSources(scope: Scope, range: StatsQueryDto): Promise<SourceGroup[]> {
    const query = this.scoped("e", scope, this.events.createQueryBuilder("e"))
      .select("e.utmSource", "utmSource")
      .addSelect("e.utmMedium", "utmMedium")
      .addSelect("e.utmCampaign", "utmCampaign")
      .addSelect("e.referrerHost", "referrerHost")
      .addSelect("e.referrerInternal", "referrerInternal")
      .addSelect("COUNT(*)", "clicks")
      .andWhere("e.kind = :kind", { kind: "click" })
      .groupBy("e.utmSource")
      .addGroupBy("e.utmMedium")
      .addGroupBy("e.utmCampaign")
      .addGroupBy("e.referrerHost")
      .addGroupBy("e.referrerInternal");

    return this.inRange(query, "e", range).getRawMany<SourceGroup>();
  }

  private blockClicks(scope: Scope, range: StatsQueryDto): Promise<BlockClicks[]> {
    const query = this.scoped("e", scope, this.events.createQueryBuilder("e"))
      .select("e.blockId", "blockId")
      .addSelect("COUNT(*)", "clicks")
      .addSelect("COUNT(DISTINCT e.visitorHash)", "visitors")
      .andWhere("e.kind = :kind", { kind: "click" })
      .groupBy("e.blockId")
      .orderBy("e.blockId", "ASC");

    return this.inRange(query, "e", range)
      .getRawMany<BlockClicks>()
      .then((rows) =>
        rows.map((row) => ({
          blockId: String(row.blockId),
          clicks: Number(row.clicks),
          visitors: Number(row.visitors),
        })),
      );
  }

  /** One page, or every page the caller owns: the only difference between the two screens' reads. */
  private scoped<Entity extends ObjectLiteral>(
    alias: string,
    scope: Scope,
    query: SelectQueryBuilder<Entity>,
  ): SelectQueryBuilder<Entity> {
    return "linkId" in scope
      ? query.where(`${alias}.linkId = :linkId`, { linkId: scope.linkId })
      : query.where(`${alias}.linkId IN (:...ids)`, { ids: scope.ids });
  }

  /** Both bounds are optional, and an absent one leaves that side unbounded. */
  private inRange<Entity extends ObjectLiteral>(
    query: SelectQueryBuilder<Entity>,
    alias: string,
    range: StatsQueryDto,
  ): SelectQueryBuilder<Entity> {
    /* `createdAt` is stored in SQLite's own format, so both sides go through `datetime()` to compare. */
    if (range.from) query.andWhere(`datetime(${alias}.createdAt) >= datetime(:from)`, { from: range.from });
    if (range.to) query.andWhere(`datetime(${alias}.createdAt) <= datetime(:to)`, { to: range.to });

    return query;
  }

  /** Days with no rows in either table stay absent; the client fills the range it asked for. */
  private mergeSeries(...series: Partial<StatsPoint>[][]): StatsPoint[] {
    const byDate = new Map<string, StatsPoint>();

    for (const rows of series) {
      for (const row of rows) {
        const date = String(row.date);
        const point = byDate.get(date) ?? { date, views: 0, visitors: 0, clicks: 0 };

        point.views += Number(row.views ?? 0);
        point.visitors += Number(row.visitors ?? 0);
        point.clicks += Number(row.clicks ?? 0);
        byDate.set(date, point);
      }
    }

    /* Sorted in place on an array built two lines above: there is no original anybody else holds. */
    // oxlint-disable-next-line unicorn/no-array-sort
    return [...byDate.values()].sort((left, right) => left.date.localeCompare(right.date));
  }

  /** Two tables contribute to one source row, so the same label from both lands in one entry. */
  private mergeSources(...groups: SourceGroup[][]): StatsSource[] {
    const byLabel = new Map<string, StatsSource>();

    for (const rows of groups) {
      for (const row of rows) {
        const label: SourceLabel = classifySource({
          utmSource: row.utmSource,
          utmMedium: row.utmMedium,
          utmCampaign: row.utmCampaign,
          referrerHost: row.referrerHost,
          referrerInternal: Boolean(row.referrerInternal),
        });
        const key = `${label.source}|${label.medium}`;
        const entry = byLabel.get(key) ?? { ...label, views: 0, visitors: 0, clicks: 0 };

        entry.views += Number(row.views ?? 0);
        entry.visitors += Number(row.visitors ?? 0);
        entry.clicks += Number(row.clicks ?? 0);
        byLabel.set(key, entry);
      }
    }

    /* Ranked by what the table shows first, then by engagement; the tie-break keeps the order stable. */
    // oxlint-disable-next-line unicorn/no-array-sort
    return [...byLabel.values()].sort(
      (left, right) =>
        right.views - left.views || right.clicks - left.clicks || left.source.localeCompare(right.source),
    );
  }
}
