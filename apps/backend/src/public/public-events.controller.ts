import type { Request } from "express";

import { BadRequestException, Body, Controller, Param, Post, Req } from "@nestjs/common";

import { AnalyticsService } from "../analytics/analytics.service";
import { RecordBlockEventDto } from "../analytics/dto/block-event.dto";
import { RecordPageViewDto } from "../analytics/dto/event-source.dto";
import { toSourceColumns } from "../analytics/source";
import { visitorHashOf } from "../analytics/visitor-hash";
import { blockIdsOf } from "../links/block-ids";
import { LinksService } from "../links/links.service";

/**
 * The one unauthenticated write of the analytics feature: a page in front of a visitor reporting that a
 * block was clicked. It resolves the page first, so a draft says the same 404 a slug nobody holds does.
 */
@Controller("public")
export class PublicEventsController {
  constructor(
    private readonly linksService: LinksService,
    private readonly analytics: AnalyticsService,
  ) {}

  /**
   * A page load, reported once per document. The visitor is a hash of the address and the agent, computed
   * here because this is the only layer that has a request — and never stored beyond the event's own row.
   */
  @Post("links/:slug/views")
  async recordView(@Param("slug") slug: string, @Body() body: RecordPageViewDto, @Req() req: Request) {
    const link = await this.linksService.getPublishedBySlug(slug);

    await this.analytics.recordView(link.id, this.visitorOf(req), toSourceColumns(body));

    return { ok: true };
  }

  @Post("links/:slug/events")
  async record(@Param("slug") slug: string, @Body() body: RecordBlockEventDto, @Req() req: Request) {
    const link = await this.linksService.getPublishedBySlug(slug);

    /*
      The id is read from the page the server just loaded, never trusted from the body: it becomes both a
      stored row and an in-memory window key, so an id the page does not hold would grow the table and the
      window with traffic instead of with content — and fill the owner's stats with blocks that do not exist.
    */
    if (!blockIdsOf(link).has(body.blockId)) throw new BadRequestException("This page has no such block.");

    await this.analytics.record(link.id, body.blockId, body.kind, this.visitorOf(req), toSourceColumns(body));

    return { ok: true };
  }

  private visitorOf(req: Request): string {
    return visitorHashOf({
      ip: req.ip ?? "",
      userAgent: req.header("user-agent") ?? "",
      at: new Date(),
    });
  }
}
