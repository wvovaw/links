import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BlockAsset } from "../storage/block-asset.entity";
import { BlockImage } from "../storage/block-image.entity";
import { LocalStorageService } from "../storage/local-storage.service";
import { User } from "../users/user.entity";
import { CreateLinkDto, defaultBackground, UpdateContentDto, UpdateMetadataDto, UpdateSlugDto } from "./dto/link.dto";
import { UpdateThemeDto } from "./dto/theme.dto";
import { LinkStatus } from "./link-status";
import { Link } from "./link.entity";

/**
 * Keeps one attachment table in step with the files a page still names: a file it has dropped loses
 * its row, then its bytes; a file it has gained gains a row. Images and assets are kept by the same
 * rule, so a page cannot end up with a file one table forgot.
 */
async function diffFiles<T extends { fileId: string }>(
  stored: T[],
  fileIds: string[],
  discardFile: (fileId: string) => Promise<void>,
  forgetRow: (row: T) => Promise<unknown>,
  rememberFile: (fileId: string) => Promise<unknown>,
) {
  const requested = new Set(fileIds);

  for (const row of stored) {
    if (requested.has(row.fileId)) continue;

    await discardFile(row.fileId).catch(() => {});
    await forgetRow(row);
  }

  const storedFileIds = new Set(stored.map((row) => row.fileId));
  for (const fileId of requested) {
    if (!storedFileIds.has(fileId)) await rememberFile(fileId);
  }
}

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link) private readonly links: Repository<Link>,
    @InjectRepository(BlockImage) private readonly blockImages: Repository<BlockImage>,
    @InjectRepository(BlockAsset) private readonly blockAssets: Repository<BlockAsset>,
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

    this.applyStatus(link, body.status);

    const saved = await this.links.save(link);

    if (body.imageFileIds !== undefined || body.assetFileIds !== undefined)
      await this.syncAttachments(link, body.imageFileIds, body.assetFileIds);

    return saved;
  }

  async updateTheme(owner: User, id: string, body: UpdateThemeDto) {
    const link = await this.getOwned(owner, id);

    link.theme = body.toPageTheme();

    return this.links.save(link);
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
    await this.discardFiles(link);
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

  /**
   * Each kind of file is optional: an update that does not report one leaves that kind alone rather
   * than deleting it, and `undefined` is not the same answer as an empty list.
   */
  private async syncAttachments(link: Link, imageFileIds?: string[], assetFileIds?: string[]) {
    if (imageFileIds) {
      await diffFiles(
        await this.blockImages.find({ where: { link: { id: link.id } } }),
        imageFileIds,
        (fileId) => this.storage.removeImage(fileId),
        (image) => this.blockImages.remove(image),
        (fileId) => this.blockImages.save(this.blockImages.create({ fileId, link })),
      );
    }

    if (assetFileIds) {
      await diffFiles(
        await this.blockAssets.find({ where: { link: { id: link.id } } }),
        assetFileIds,
        (fileId) => this.storage.removeAsset(fileId),
        (asset) => this.blockAssets.remove(asset),
        (fileId) => this.blockAssets.save(this.blockAssets.create({ fileId, link })),
      );
    }
  }

  /** The rows cascade with the link; the bytes they name have no such cascade, so they go first. */
  private async discardFiles(link: Link) {
    const images = await this.blockImages.find({ where: { link: { id: link.id } } });
    for (const image of images) await this.storage.removeImage(image.fileId).catch(() => {});

    const assets = await this.blockAssets.find({ where: { link: { id: link.id } } });
    for (const asset of assets) await this.storage.removeAsset(asset.fileId).catch(() => {});
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
