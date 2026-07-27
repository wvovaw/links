import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

@Injectable()
export class LocalStorageService {
  private readonly avatarRoot = process.env.UPLOADS_PATH ?? "uploads/avatars";
  private readonly imageRoot = process.env.IMAGES_PATH ?? "uploads/images";

  async saveAvatar(file: Express.Multer.File) {
    await mkdir(this.avatarRoot, { recursive: true });

    const extension = this.extensionFor(file);
    const fileId = `${randomUUID()}${extension}`;
    await writeFile(join(this.avatarRoot, fileId), file.buffer);

    return fileId;
  }

  async removeAvatar(fileId: string) {
    await rm(this.avatarPath(fileId), { force: true });
  }

  avatarPath(fileId: string) {
    if (fileId.includes("/") || fileId.includes("\\"))
      throw new NotFoundException("Avatar not found.");

    return join(this.avatarRoot, fileId);
  }

  async saveImage(file: Express.Multer.File) {
    await mkdir(this.imageRoot, { recursive: true });

    const extension = this.extensionFor(file);
    const fileId = `${randomUUID()}${extension}`;
    await writeFile(join(this.imageRoot, fileId), file.buffer);

    return fileId;
  }

  async removeImage(fileId: string) {
    await rm(this.imagePath(fileId), { force: true });
  }

  imagePath(fileId: string) {
    if (fileId.includes("/") || fileId.includes("\\"))
      throw new NotFoundException("Image not found.");

    return join(this.imageRoot, fileId);
  }

  private extensionFor(file: Express.Multer.File) {
    if (file.mimetype === "image/png")
      return ".png";
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg")
      return ".jpg";
    if (file.mimetype === "image/webp")
      return ".webp";
    if (file.mimetype === "image/gif")
      return ".gif";

    return extname(file.originalname);
  }
}
