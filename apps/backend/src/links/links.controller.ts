import { Controller, Delete, Get, HttpCode, Param, Patch, Post, Body, UseGuards } from "@nestjs/common";

import { AuthGuard } from "../common/auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { User } from "../users/user.entity";
import { CreateLinkDto, UpdateContentDto, UpdateMetadataDto, UpdateSlugDto } from "./dto/link.dto";
import { toLinkDto } from "./link.dto";
import { LinksService } from "./links.service";

@Controller("links")
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

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

  @Patch(":id/content")
  @UseGuards(AuthGuard)
  async updateContent(@CurrentUser() user: User, @Param("id") id: string, @Body() body: UpdateContentDto) {
    return toLinkDto(await this.linksService.updateContent(user, id, body));
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
