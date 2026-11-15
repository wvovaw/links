import { Body, Controller, Param, Post } from "@nestjs/common";

import { AnalyticsService } from "../analytics/analytics.service";
import { RecordBlockEventDto } from "../analytics/dto/block-event.dto";
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

  @Post("links/:slug/events")
  async record(@Param("slug") slug: string, @Body() body: RecordBlockEventDto) {
    const link = await this.linksService.getPublishedBySlug(slug);

    await this.analytics.record(link.id, body.blockId, body.kind);

    return { ok: true };
  }
}
