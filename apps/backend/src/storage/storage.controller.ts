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
import { access } from "node:fs/promises";

import { AuthGuard } from "../common/auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { User } from "../users/user.entity";
import {
  assetUploadCapBytes,
  isAssetMimeType,
  LocalStorageService,
  maxAssetBytes,
  maxImageBytes,
} from "./local-storage.service";
import { UploadTooLargeFilter } from "./upload-too-large.filter";
import { UploadedFilesService } from "./uploaded-files.service";

@Controller("storage")
export class StorageController {
  constructor(
    private readonly storage: LocalStorageService,
    private readonly uploadedFiles: UploadedFilesService,
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
  async uploadImage(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
    const fileId = await this.storage.saveImage(file);
    await this.uploadedFiles.record(user, "image", fileId);

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

  /**
   * Deletes an image only for the account that uploaded it, taking the upload record with the bytes. An image
   * id is visible on a published page, so an unscoped route let any registered user empty another owner's
   * page; the upload record answers that without refusing to delete an image that is uploaded but not yet on
   * a saved page.
   */
  @Delete("images/:fileId")
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteImage(@CurrentUser() user: User, @Param("fileId") fileId: string) {
    const discarded = await this.uploadedFiles.discard(user.id, "image", fileId, (id) => this.storage.removeImage(id));
    if (!discarded) throw new NotFoundException("Image not found.");
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
  async uploadAsset(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Asset file is required.");
    if (!isAssetMimeType(file.mimetype)) throw new BadRequestException("Unsupported asset type.");

    const limit = maxAssetBytes(file.mimetype);
    if (file.size > limit) throw new PayloadTooLargeException(`File must be ${limit} bytes or smaller.`);

    const fileId = await this.storage.saveAsset(file);
    await this.uploadedFiles.record(user, "asset", fileId);

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
   * Deletes an asset only for the account that uploaded it, taking the upload record with the bytes. Asset
   * ids are visible on a published page and the GET above is public, so the identity of the delete has to
   * come from the upload record rather than from a page that happens to name the file — a page can be made to
   * name anyone's id. A stranger's answer is the same 404 an unknown id gets, so the response confirms
   * nothing.
   */
  @Delete("assets/:fileId")
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteAsset(@CurrentUser() user: User, @Param("fileId") fileId: string) {
    const discarded = await this.uploadedFiles.discard(user.id, "asset", fileId, (id) => this.storage.removeAsset(id));
    if (!discarded) throw new NotFoundException("Asset not found.");
  }
}
