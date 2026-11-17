import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { BlockEventKind } from "./block-event.entity";
import type { BlockStatsQueryDto } from "./dto/block-event.dto";

import { SlidingWindow } from "../common/sliding-window";
import { BlockEvent } from "./block-event.entity";

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

@Injectable()
export class AnalyticsService {
  /**
   * A block takes 60 events a minute and a page takes 300 across all its blocks: without the second
   * ceiling a page with ten blocks would accept ten times the stream, and nothing prunes that table yet.
   */
  private readonly window = new SlidingWindow({ perKey: 60, perScope: 300 });

  constructor(@InjectRepository(BlockEvent) private readonly events: Repository<BlockEvent>) {}

  /**
   * Stores an accepted event, or refuses before touching the table: a rejected request must leave no row
   * behind, or the window would not be the only thing it changed.
   */
  async record(linkId: string, blockId: string, kind: BlockEventKind) {
    this.window.admit(linkId, `${linkId}:${blockId}`, refusedEvent);

    await this.events.save(this.events.create({ linkId, blockId, kind }));
  }

  /** One grouped query: the database counts, and a block with no events simply has no row. */
  async blockStats(linkId: string, range: BlockStatsQueryDto): Promise<BlockStats[]> {
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
