import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { access } from "node:fs/promises";

import { AuthGuard } from "../common/auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { User } from "../users/user.entity";
import { LocalStorageService } from "./local-storage.service";

@Controller("storage")
export class StorageController {
  constructor(private readonly storage: LocalStorageService) {}

  @Get("avatars/:fileId")
  async getAvatar(@Param("fileId") fileId: string, @Res() response: Response) {
    const path = this.storage.avatarPath(fileId);

    try {
      await access(path);
    } catch {
      throw new NotFoundException("Avatar not found.");
    }

    response.sendFile(path, { root: process.cwd() });
  }

  @Post("images")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("file"))
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

    response.sendFile(path, { root: process.cwd() });
  }

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
}
