import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { UploadedFileKind } from "../storage/uploaded-file.entity";

import { BlockAsset } from "../storage/block-asset.entity";
import { BlockImage } from "../storage/block-image.entity";
import { LocalStorageService } from "../storage/local-storage.service";
import { UploadedFilesService } from "../storage/uploaded-files.service";
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
    private readonly uploadedFiles: UploadedFilesService,
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
      await this.syncAttachments(owner, link, body.imageFileIds, body.assetFileIds);

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
    await this.discardFiles(owner, link);
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
  private async syncAttachments(owner: User, link: Link, imageFileIds?: string[], assetFileIds?: string[]) {
    if (imageFileIds) {
      const stored = await this.blockImages.find({ where: { link: { id: link.id } } });
      await this.assertClaimable(owner, "image", stored, imageFileIds);

      await diffFiles(
        stored,
        imageFileIds,
        (fileId) => this.discardFile(owner, "image", fileId),
        (image) => this.blockImages.remove(image),
        (fileId) => this.blockImages.save(this.blockImages.create({ fileId, link })),
      );
    }

    if (assetFileIds) {
      const stored = await this.blockAssets.find({ where: { link: { id: link.id } } });
      await this.assertClaimable(owner, "asset", stored, assetFileIds);

      await diffFiles(
        stored,
        assetFileIds,
        (fileId) => this.discardFile(owner, "asset", fileId),
        (asset) => this.blockAssets.remove(asset),
        (fileId) => this.blockAssets.save(this.blockAssets.create({ fileId, link })),
      );
    }
  }

  /**
   * A page may name only files its owner uploaded. A file id is visible on a published page, so without this
   * rule any registered user could attach another owner's file to their own page — and a page that names a
   * file is enough to delete it, on the paths that delete what a page drops.
   *
   * A file with no upload record predates the table, and nothing can say whose it is: it may keep the claim a
   * page already holds, so pages that were working stay working, but no page may newly claim it. A file whose
   * record names a different owner is refused even when the page already holds it — that is a stale claim
   * made before this rule, and a save is where it stops.
   */
  private async assertClaimable(
    owner: User,
    kind: UploadedFileKind,
    stored: { fileId: string }[],
    requested: string[],
  ) {
    const alreadyNamed = new Set(stored.map((row) => row.fileId));

    for (const fileId of requested) {
      const uploader = await this.uploadedFiles.ownerOf(kind, fileId);

      if (uploader === owner.id) continue;
      if (uploader === null && alreadyNamed.has(fileId)) continue;

      throw new BadRequestException("You can only attach files you uploaded.");
    }
  }

  /**
   * Removes the bytes a page still names before the link (and its attachment rows) goes. The bytes go through
   * the same uploader check every other removal does, so a page holding a file its owner did not upload —
   * only reachable through a claim made before the upload records existed — leaves that file on disk.
   */
  private async discardFiles(owner: User, link: Link) {
    const images = await this.blockImages.find({ where: { link: { id: link.id } } });
    for (const image of images) await this.discardFile(owner, "image", image.fileId);

    const assets = await this.blockAssets.find({ where: { link: { id: link.id } } });
    for (const asset of assets) await this.discardFile(owner, "asset", asset.fileId);
  }

  /**
   * Deletes one file's bytes and its upload record, for the page's owner. A file that was never uploaded
   * through this API — or whose upload record is gone — has no uploader to compare against, so nothing is
   * deleted: the id becomes an orphan on disk, which is the trade this rule makes in exchange for no page
   * being able to delete another account's file by naming it.
   */
  private async discardFile(owner: User, kind: UploadedFileKind, fileId: string) {
    const removeBytes = (id: string) =>
      kind === "image" ? this.storage.removeImage(id) : this.storage.removeAsset(id);

    /* A page is being saved or dropped: a failed unlink must not fail the request that no longer needs it. */
    await this.uploadedFiles.discard(owner.id, kind, fileId, removeBytes).catch(() => {});
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
