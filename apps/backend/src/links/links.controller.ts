import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";

import { AnalyticsService } from "../analytics/analytics.service";
import { StatsQueryDto } from "../analytics/dto/block-event.dto";
import { AuthGuard } from "../common/auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { SubmissionsQueryDto } from "../forms/dto/submission.dto";
import { FormsService } from "../forms/forms.service";
import { User } from "../users/user.entity";
import { CreateLinkDto, UpdateContentDto, UpdateMetadataDto, UpdateSlugDto } from "./dto/link.dto";
import { UpdateThemeDto } from "./dto/theme.dto";
import { toLinkDto } from "./link.dto";
import { LinksService } from "./links.service";

@Controller("links")
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
    private readonly analytics: AnalyticsService,
    private readonly forms: FormsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@CurrentUser() user: User, @Body() body: CreateLinkDto) {
    return toLinkDto(await this.linksService.create(user, body));
  }

  @Get()
  @UseGuards(AuthGuard)
  async list(@CurrentUser() user: User) {
    return (await this.linksService.list(user)).map(toLinkDto);
  }

  @Get("slug/:slug/availability")
  async slugAvailability(@Param("slug") slug: string) {
    return { available: await this.linksService.isSlugAvailable(slug) };
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  async get(@CurrentUser() user: User, @Param("id") id: string) {
    return toLinkDto(await this.linksService.getOwned(user, id));
  }

  /**
   * Ownership is settled before any aggregate runs: `getOwned` answers 404 for a link the caller does not
   * own, so one owner cannot read another page's counters.
   */
  @Get(":id/stats")
  @UseGuards(AuthGuard)
  async stats(@CurrentUser() user: User, @Param("id") id: string, @Query() query: StatsQueryDto) {
    const link = await this.linksService.getOwned(user, id);

    return this.analytics.linkStats(link.id, query);
  }

  /**
   * Ownership is settled before any query runs: `getOwned` answers 404 for a link the caller does not own,
   * so one owner cannot read the messages visitors left on another page.
   */
  @Get(":id/submissions")
  @UseGuards(AuthGuard)
  async submissions(@CurrentUser() user: User, @Param("id") id: string, @Query() query: SubmissionsQueryDto) {
    const link = await this.linksService.getOwned(user, id);

    return { submissions: await this.forms.list(link.id, query) };
  }

  @Patch(":id/content")
  @UseGuards(AuthGuard)
  async updateContent(@CurrentUser() user: User, @Param("id") id: string, @Body() body: UpdateContentDto) {
    return toLinkDto(await this.linksService.updateContent(user, id, body));
  }

  @Patch(":id/theme")
  @UseGuards(AuthGuard)
  async updateTheme(@CurrentUser() user: User, @Param("id") id: string, @Body() body: UpdateThemeDto) {
    return toLinkDto(await this.linksService.updateTheme(user, id, body));
  }

  @Patch(":id/metadata")
  @UseGuards(AuthGuard)
  async updateMetadata(@CurrentUser() user: User, @Param("id") id: string, @Body() body: UpdateMetadataDto) {
    return toLinkDto(await this.linksService.updateMetadata(user, id, body));
  }

  @Patch(":id/slug")
  @UseGuards(AuthGuard)
  async updateSlug(@CurrentUser() user: User, @Param("id") id: string, @Body() body: UpdateSlugDto) {
    return toLinkDto(await this.linksService.updateSlug(user, id, body));
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async remove(@CurrentUser() user: User, @Param("id") id: string) {
    await this.linksService.remove(user, id);
  }
}
