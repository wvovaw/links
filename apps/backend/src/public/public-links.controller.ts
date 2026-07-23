import { Controller, Get, Param } from "@nestjs/common";
import { toPublicLinkDto } from "../links/link.dto";
import { LinksService } from "../links/links.service";

@Controller("public")
export class PublicLinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get("links/:slug")
  async getPublicLink(@Param("slug") slug: string) {
    return toPublicLinkDto(await this.linksService.getPublishedBySlug(slug));
  }
}
