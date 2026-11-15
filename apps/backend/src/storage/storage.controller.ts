import type { Response } from "express";

import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  PayloadTooLargeException,
  Post,
  Res,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { InjectRepository } from "@nestjs/typeorm";
import { access } from "node:fs/promises";
import { Repository } from "typeorm";

import { AuthGuard } from "../common/auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { User } from "../users/user.entity";
import { BlockAsset } from "./block-asset.entity";
import {
  assetUploadCapBytes,
  isAssetMimeType,
  LocalStorageService,
  maxAssetBytes,
  maxImageBytes,
} from "./local-storage.service";
import { UploadTooLargeFilter } from "./upload-too-large.filter";

@Controller("storage")
export class StorageController {
  constructor(
    private readonly storage: LocalStorageService,
    @InjectRepository(BlockAsset) private readonly assets: Repository<BlockAsset>,
  ) {}

  @Get("avatars/:fileId")
  async getAvatar(@Param("fileId") fileId: string, @Res() response: Response) {
    const path = this.storage.avatarPath(fileId);

    try {
      await access(path);
    } catch {
      throw new NotFoundException("Avatar not found.");
    }

    response.sendFile(path);
  }

  @Post("images")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("file", { limits: () => ({ fileSize: maxImageBytes() }) }))
  @UseFilters(UploadTooLargeFilter)
  async uploadImage(@CurrentUser() _user: User, @UploadedFile() file: Express.Multer.File) {
    const fileId = await this.storage.saveImage(file);
    return { fileId };
  }

  @Get("images/:fileId")
  async getImage(@Param("fileId") fileId: string, @Res() response: Response) {
    const path = this.storage.imagePath(fileId);

    try {
      await access(path);
    } catch {
      throw new NotFoundException("Image not found.");
    }

    response.sendFile(path);
  }

  /*
    Authenticated but not owner-scoped, unlike the asset route below — the same hole, left as it was.
    Scoping it the same way would refuse to delete an image that is uploaded but not yet on a saved
    page, and closing it properly needs an ownership record at upload time. Tracked as a follow-up.
  */
  @Delete("images/:fileId")
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteImage(@CurrentUser() _user: User, @Param("fileId") fileId: string) {
    const path = this.storage.imagePath(fileId);

    try {
      await access(path);
    } catch {
      throw new NotFoundException("Image not found.");
    }

    await this.storage.removeImage(fileId);
  }

  /**
   * A video, an audio clip or a pdf. The allowlist is checked twice on purpose: multer tells us the
   * declared type before it buffers the body, so a refused type costs no memory, and the handler
   * checks again because it is the last place before bytes reach the disk.
   */
  @Post("assets")
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor("file", {
      limits: () => ({ fileSize: assetUploadCapBytes() }),
      fileFilter: (_request, file, callback) => {
        if (!isAssetMimeType(file.mimetype)) return callback(new BadRequestException("Unsupported asset type."), false);

        callback(null, true);
      },
    }),
  )
  async uploadAsset(@CurrentUser() _user: User, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Asset file is required.");
    if (!isAssetMimeType(file.mimetype)) throw new BadRequestException("Unsupported asset type.");

    const limit = maxAssetBytes(file.mimetype);
    if (file.size > limit) throw new PayloadTooLargeException(`File must be ${limit} bytes or smaller.`);

    const fileId = await this.storage.saveAsset(file);
    return { fileId };
  }

  /** Served through `res.sendFile`, so a browser can seek inside a video with a range request. */
  @Get("assets/:fileId")
  async getAsset(@Param("fileId") fileId: string, @Res() response: Response) {
    const path = this.storage.assetPath(fileId);

    try {
      await access(path);
    } catch {
      throw new NotFoundException("Asset not found.");
    }

    response.sendFile(path);
  }

  /**
   * Scoped to the owner of the link that holds the asset. Asset ids are visible on a published page
   * and the GET above is public, so an unscoped delete would let any registered user empty another
   * owner's page. A stranger's id answers 404 rather than 403, so the response confirms nothing; an
   * asset no link holds yet is nobody's to delete here, and answers the same 404.
   */
  @Delete("assets/:fileId")
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteAsset(@CurrentUser() user: User, @Param("fileId") fileId: string) {
    const asset = await this.assets.findOne({ where: { fileId, link: { owner: { id: user.id } } } });
    if (!asset) throw new NotFoundException("Asset not found.");

    const path = this.storage.assetPath(fileId);

    try {
      await access(path);
    } catch {
      throw new NotFoundException("Asset not found.");
    }

    await this.storage.removeAsset(fileId);
  }
}
