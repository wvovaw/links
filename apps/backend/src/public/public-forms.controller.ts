import { BadRequestException, Body, Controller, Param, Post } from "@nestjs/common";

import { CreateSubmissionDto } from "../forms/dto/submission.dto";
import { FormsService } from "../forms/forms.service";
import { blockIdsOf } from "../links/block-ids";
import { LinksService } from "../links/links.service";

/**
 * The one unauthenticated write of the forms feature: a visitor filling in a block on a published page.
 * It resolves the page first, so a draft says the same 404 a slug nobody holds does.
 */
@Controller("public")
export class PublicFormsController {
  constructor(
    private readonly linksService: LinksService,
    private readonly forms: FormsService,
  ) {}

  @Post("links/:slug/submissions")
  async create(@Param("slug") slug: string, @Body() body: CreateSubmissionDto) {
    const link = await this.linksService.getPublishedBySlug(slug);

    /*
      The id is read from the page the server just loaded, never trusted from the body: it becomes a stored
      row and an owner-visible list, so a form that is not on the page must not be able to write to it.
    */
    if (!blockIdsOf(link).has(body.blockId)) throw new BadRequestException("This page has no such block.");

    await this.forms.create(link.id, body);

    return { ok: true };
  }
}
