import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";
import { CreateLinkDto, defaultBackground, UpdateContentDto, UpdateMetadataDto, UpdateSlugDto } from "./dto/link.dto";
import { Link } from "./link.entity";
import { LinkStatus } from "./link-status";

@Injectable()
export class LinksService {
  constructor(@InjectRepository(Link) private readonly links: Repository<Link>) {}

  async create(owner: User, body: CreateLinkDto) {
    await this.assertSlugAvailable(body.slug);

    const link = this.links.create({
      owner,
      slug: body.slug,
      title: body.title ?? `${owner.name} links`,
      blocks: [],
      seo: {},
      background: defaultBackground,
      status: LinkStatus.FRESH,
    });

    return this.links.save(link);
  }

  list(owner: User) {
    return this.links.find({
      where: { owner: { id: owner.id } },
      order: { createdAt: "DESC" },
    });
  }

  async getOwned(owner: User, id: string) {
    const link = await this.links.findOne({
      where: { id, owner: { id: owner.id } },
      relations: { owner: true },
    });

    if (!link)
      throw new NotFoundException("Link not found.");

    return link;
  }

  async updateContent(owner: User, id: string, body: UpdateContentDto) {
    const link = await this.getOwned(owner, id);

    if (body.blocks !== undefined)
      link.blocks = body.blocks;
    if (body.background !== undefined)
      link.background = body.background;

    this.applyStatus(link, body.status);
    return this.links.save(link);
  }

  async updateMetadata(owner: User, id: string, body: UpdateMetadataDto) {
    const link = await this.getOwned(owner, id);

    if (body.title !== undefined)
      link.title = body.title;
    if (body.seo !== undefined)
      link.seo = body.seo;

    this.applyStatus(link, body.status);
    return this.links.save(link);
  }

  async updateSlug(owner: User, id: string, body: UpdateSlugDto) {
    const link = await this.getOwned(owner, id);

    if (link.slug !== body.slug) {
      await this.assertSlugAvailable(body.slug);
      link.slug = body.slug;
    }

    return this.links.save(link);
  }

  async remove(owner: User, id: string) {
    const link = await this.getOwned(owner, id);
    await this.links.remove(link);
  }

  async isSlugAvailable(slug: string) {
    return !await this.links.existsBy({ slug });
  }

  async getPublishedBySlug(slug: string) {
    const link = await this.links.findOneBy({ slug, status: LinkStatus.PUBLISHED });
    if (!link)
      throw new NotFoundException("Public link not found.");

    return link;
  }

  private applyStatus(link: Link, requestedStatus?: LinkStatus) {
    if (requestedStatus) {
      link.status = requestedStatus;
      return;
    }

    if (link.status === LinkStatus.FRESH)
      link.status = LinkStatus.DRAFT;
  }

  private async assertSlugAvailable(slug: string) {
    if (!await this.isSlugAvailable(slug))
      throw new ConflictException("Slug is already reserved.");
  }
}
