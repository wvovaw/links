import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { BlockEventKind } from "./block-event.entity";
import type { SourceColumns } from "./source";
import type { StatsQueryDto } from "./dto/block-event.dto";

import { SlidingWindow } from "../common/sliding-window";
import { BlockEvent } from "./block-event.entity";
import { PageView } from "./page-view.entity";

export interface BlockStats {
  blockId: string;
  clicks: number;
  views: number;
}

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

  /**
   * Stores an accepted event, or refuses before touching the table: a rejected request must leave no row
   * behind, or the window would not be the only thing it changed.
   */
  async record(linkId: string, blockId: string, kind: BlockEventKind, visitorHash: string, source: SourceColumns) {
    this.window.admit(linkId, `${linkId}:${blockId}`, refusedEvent);

    await this.events.save(this.events.create({ linkId, blockId, kind, visitorHash, ...source }));
  }

  /** One grouped query: the database counts, and a block with no events simply has no row. */
  async blockStats(linkId: string, range: StatsQueryDto): Promise<BlockStats[]> {
    const query = this.events
      .createQueryBuilder("event")
      .select("event.blockId", "blockId")
      .addSelect("SUM(CASE WHEN event.kind = :click THEN 1 ELSE 0 END)", "clicks")
      .addSelect("SUM(CASE WHEN event.kind = :view THEN 1 ELSE 0 END)", "views")
      .where("event.linkId = :linkId", { linkId })
      .setParameters({ click: "click", view: "view" })
      .groupBy("event.blockId")
      .orderBy("event.blockId", "ASC");

    /* `createdAt` is stored in SQLite's own format, so both sides go through `datetime()` to compare. */
    if (range.from) query.andWhere("datetime(event.createdAt) >= datetime(:from)", { from: range.from });
    if (range.to) query.andWhere("datetime(event.createdAt) <= datetime(:to)", { to: range.to });

    const rows = await query.getRawMany<{ blockId: string; clicks: number; views: number }>();

    return rows.map((row) => ({ blockId: String(row.blockId), clicks: Number(row.clicks), views: Number(row.views) }));
  }
}
