import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Put,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AuthGuard } from "../common/auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { LocalStorageService, maxImageBytes } from "../storage/local-storage.service";
import { UploadTooLargeFilter } from "../storage/upload-too-large.filter";
import { UploadedFilesService } from "../storage/uploaded-files.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { toUserDto } from "./user.dto";
import { User } from "./user.entity";

@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly storage: LocalStorageService,
    private readonly uploadedFiles: UploadedFilesService,
  ) {}

  @Get("me")
  getMe(@CurrentUser() user: User) {
    return toUserDto(user);
  }

  @Patch("me")
  async updateMe(@CurrentUser() user: User, @Body() body: UpdateUserDto) {
    if (body.name !== undefined) user.name = body.name;

    return toUserDto(await this.users.save(user));
  }

  @Put("me/avatar")
  @UseInterceptors(FileInterceptor("avatar", { limits: () => ({ fileSize: maxImageBytes() }) }))
  @UseFilters(UploadTooLargeFilter)
  async updateAvatar(@CurrentUser() user: User, @UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException("Avatar file is required.");

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype))
      throw new BadRequestException("Only JPEG and PNG avatars are allowed.");

    if (user.avatarFileId) await this.storage.removeAvatar(user.avatarFileId);

    user.avatarFileId = await this.storage.saveAvatar(file);
    await this.uploadedFiles.record(user, "avatar", user.avatarFileId);

    return toUserDto(await this.users.save(user));
  }

  @Delete("me/avatar")
  async removeAvatar(@CurrentUser() user: User) {
    if (user.avatarFileId) await this.storage.removeAvatar(user.avatarFileId);

    user.avatarFileId = null;
    return toUserDto(await this.users.save(user));
  }
}
