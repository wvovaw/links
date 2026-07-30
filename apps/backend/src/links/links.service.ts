import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BlockImage } from "../storage/block-image.entity";
import { LocalStorageService } from "../storage/local-storage.service";
import { User } from "../users/user.entity";
import { CreateLinkDto, defaultBackground, UpdateContentDto, UpdateMetadataDto, UpdateSlugDto } from "./dto/link.dto";
import { LinkStatus } from "./link-status";
import { Link } from "./link.entity";

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link) private readonly links: Repository<Link>,
    @InjectRepository(BlockImage) private readonly blockImages: Repository<BlockImage>,
    private readonly storage: LocalStorageService,
  ) {}

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

    if (!link) throw new NotFoundException("Link not found.");

    return link;
  }

  async updateContent(owner: User, id: string, body: UpdateContentDto) {
    const link = await this.getOwned(owner, id);

    if (body.blocks !== undefined) link.blocks = body.blocks;
    if (body.background !== undefined) link.background = body.background;

    this.applyStatus(link, body.status);

    const saved = await this.links.save(link);

    if (body.imageFileIds !== undefined) await this.syncImages(link, body.imageFileIds);

    return saved;
  }

  async updateMetadata(owner: User, id: string, body: UpdateMetadataDto) {
    const link = await this.getOwned(owner, id);

    if (body.title !== undefined) link.title = body.title;
    if (body.seo !== undefined) link.seo = body.seo;

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
    const images = await this.blockImages.find({ where: { link: { id: link.id } } });
    for (const image of images) {
      await this.storage.removeImage(image.fileId).catch(() => {});
    }
    await this.links.remove(link);
  }

  async isSlugAvailable(slug: string) {
    return !(await this.links.existsBy({ slug }));
  }

  async getPublishedBySlug(slug: string) {
    const link = await this.links.findOneBy({ slug, status: LinkStatus.PUBLISHED });
    if (!link) throw new NotFoundException("Public link not found.");

    return link;
  }

  private async syncImages(link: Link, imageFileIds: string[]) {
    const existing = await this.blockImages.find({ where: { link: { id: link.id } } });
    const existingFileIds = new Set(existing.map((i) => i.fileId));
    const requestedFileIds = new Set(imageFileIds);

    for (const image of existing) {
      if (!requestedFileIds.has(image.fileId)) {
        await this.storage.removeImage(image.fileId).catch(() => {});
        await this.blockImages.remove(image);
      }
    }

    const toAdd = imageFileIds.filter((fid) => !existingFileIds.has(fid));
    for (const fileId of toAdd) {
      const image = this.blockImages.create({ fileId, link });
      await this.blockImages.save(image);
    }
  }

  private applyStatus(link: Link, requestedStatus?: LinkStatus) {
    if (requestedStatus) {
      link.status = requestedStatus;
      return;
    }

    if (link.status === LinkStatus.FRESH) link.status = LinkStatus.DRAFT;
  }

  private async assertSlugAvailable(slug: string) {
    if (!(await this.isSlugAvailable(slug))) throw new ConflictException("Slug is already reserved.");
  }
}
