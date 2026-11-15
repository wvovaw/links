import { Injectable, NotFoundException, PayloadTooLargeException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const DEFAULT_MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * Cap for an uploaded image, read per call like the storage paths. multer refuses a non-integer
 * `fileSize`, so the configured value is truncated; an unusable one falls back to the default
 * rather than failing every upload.
 */
export function maxImageBytes(): number {
  const configured = Number(process.env.MAX_IMAGE_BYTES ?? DEFAULT_MAX_IMAGE_BYTES);

  return Number.isFinite(configured) ? Math.trunc(configured) : DEFAULT_MAX_IMAGE_BYTES;
}

/** 413 for an upload multer refused as too large, reporting the limit it enforced. */
export class UploadTooLargeException extends PayloadTooLargeException {
  constructor() {
    super(`File must be ${maxImageBytes()} bytes or smaller.`);
  }
}

/**
 * Files live under the two configured roots. Both are resolved once, so a path this service hands
 * out is the absolute path `res.sendFile` needs — a configured absolute root would otherwise be
 * joined onto the process directory again.
 */
@Injectable()
export class LocalStorageService {
  private readonly avatarRoot = resolve(process.env.UPLOADS_PATH ?? "uploads/avatars");
  private readonly imageRoot = resolve(process.env.IMAGES_PATH ?? "uploads/images");

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
    if (fileId.includes("/") || fileId.includes("\\")) throw new NotFoundException("Avatar not found.");

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
    if (fileId.includes("/") || fileId.includes("\\")) throw new NotFoundException("Image not found.");

    return join(this.imageRoot, fileId);
  }

  private extensionFor(file: Express.Multer.File) {
    if (file.mimetype === "image/png") return ".png";
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") return ".jpg";
    if (file.mimetype === "image/webp") return ".webp";
    if (file.mimetype === "image/gif") return ".gif";

    return extname(file.originalname);
  }
}
