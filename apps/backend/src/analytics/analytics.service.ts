import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { BlockEventKind } from "./block-event.entity";
import type { BlockStatsQueryDto } from "./dto/block-event.dto";

import { TooManyRequestsException } from "../common/too-many-requests.exception";
import { BlockEvent } from "./block-event.entity";

/** One minute, per block: how many events a single block may report before the window closes. */
const windowMs = 60_000;
const windowLimit = 60;

export interface BlockStats {
  blockId: string;
  clicks: number;
  views: number;
}

@Injectable()
export class AnalyticsService {
  /**
   * Recent accepted event timestamps per `${linkId}:${blockId}`. The keys are page blocks, not visitors,
   * so the map grows with the content rather than with traffic; an entry whose timestamps have all aged
   * out is replaced by the next event on that block.
   */
  private readonly recent = new Map<string, number[]>();

  constructor(@InjectRepository(BlockEvent) private readonly events: Repository<BlockEvent>) {}

  /**
   * Stores an accepted event, or refuses before touching the table: a rejected request must leave no row
   * behind, or the window would not be the only thing it changed.
   */
  async record(linkId: string, blockId: string, kind: BlockEventKind) {
    this.admit(linkId, blockId);
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

  /**
   * The sliding window. It runs to completion without awaiting anything, so two clicks arriving in the
   * same tick cannot both read a count below the limit and overrun it.
   */
  private admit(linkId: string, blockId: string) {
    const key = `${linkId}:${blockId}`;
    const now = Date.now();
    const recent = (this.recent.get(key) ?? []).filter((at) => at > now - windowMs);

    if (recent.length >= windowLimit) {
      this.recent.set(key, recent);
      throw new TooManyRequestsException("Too many events for this block. Try again in a minute.");
    }

    recent.push(now);
    this.recent.set(key, recent);
  }
}
