import { BadRequestException, Body, Controller, Delete, Get, Patch, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CurrentUser } from "../common/current-user.decorator";
import { AuthGuard } from "../common/auth.guard";
import { LocalStorageService } from "../storage/local-storage.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./user.entity";
import { toUserDto } from "./user.dto";

@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly storage: LocalStorageService,
  ) {}

  @Get("me")
  getMe(@CurrentUser() user: User) {
    return toUserDto(user);
  }

  @Patch("me")
  async updateMe(@CurrentUser() user: User, @Body() body: UpdateUserDto) {
    if (body.name !== undefined)
      user.name = body.name;

    return toUserDto(await this.users.save(user));
  }

  @Put("me/avatar")
  @UseInterceptors(FileInterceptor("avatar"))
  async updateAvatar(@CurrentUser() user: User, @UploadedFile() file?: Express.Multer.File) {
    if (!file)
      throw new BadRequestException("Avatar file is required.");

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype))
      throw new BadRequestException("Only JPEG and PNG avatars are allowed.");

    if (file.size > 5 * 1024 * 1024)
      throw new BadRequestException("Avatar must be 5 MB or smaller.");

    if (user.avatarFileId)
      await this.storage.removeAvatar(user.avatarFileId);

    user.avatarFileId = await this.storage.saveAvatar(file);
    return toUserDto(await this.users.save(user));
  }

  @Delete("me/avatar")
  async removeAvatar(@CurrentUser() user: User) {
    if (user.avatarFileId)
      await this.storage.removeAvatar(user.avatarFileId);

    user.avatarFileId = null;
    return toUserDto(await this.users.save(user));
  }
}
