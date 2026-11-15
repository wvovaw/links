import { BadRequestException, Injectable, NotFoundException, PayloadTooLargeException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const DEFAULT_MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const DEFAULT_MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const DEFAULT_MAX_AUDIO_BYTES = 20 * 1024 * 1024;
const DEFAULT_MAX_DOCUMENT_BYTES = 20 * 1024 * 1024;

/** The image types the API stores, each with the extension the stored file keeps. */
const IMAGE_MIME_EXTENSIONS: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

/**
 * The non-image types the API stores, each with the extension the stored file keeps. This table is
 * the whole allowlist and the only source of an asset's extension: the name the uploader chose never
 * decides what the server keeps or how it serves the file back.
 */
export const ASSET_MIME_EXTENSIONS = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "audio/mpeg": ".mp3",
  "audio/ogg": ".ogg",
  "audio/mp4": ".m4a",
  "application/pdf": ".pdf",
} as const;

export function isAssetMimeType(mimetype: string): boolean {
  return Object.keys(ASSET_MIME_EXTENSIONS).includes(mimetype);
}

/**
 * A configured byte limit, read per call like the storage paths. multer refuses a `fileSize` that is
 * not a positive integer while the interceptor is being set up, which would turn a configuration
 * typo into a 500 on every upload: a value that cannot be a limit (negative, zero, or not finite) is
 * no setting at all, and the default stands.
 */
function limitBytes(variable: string, fallback: number): number {
  const configured = Number(process.env[variable] ?? fallback);
  if (!Number.isFinite(configured)) return fallback;

  const bytes = Math.trunc(configured);
  return bytes > 0 ? bytes : fallback;
}

/** Cap for an uploaded image. */
export function maxImageBytes(): number {
  return limitBytes("MAX_IMAGE_BYTES", DEFAULT_MAX_IMAGE_BYTES);
}

/** An asset's cap follows its kind: video is the large one, audio and documents the small ones. */
export function maxAssetBytes(mimetype: string): number {
  if (mimetype.startsWith("video/")) return limitBytes("MAX_VIDEO_BYTES", DEFAULT_MAX_VIDEO_BYTES);
  if (mimetype.startsWith("audio/")) return limitBytes("MAX_AUDIO_BYTES", DEFAULT_MAX_AUDIO_BYTES);

  return limitBytes("MAX_DOCUMENT_BYTES", DEFAULT_MAX_DOCUMENT_BYTES);
}

/**
 * The ceiling multer enforces while an asset streams in, before its kind is known to the handler.
 * Taking the largest of the three keeps that early cap from refusing a file its own kind allows; the
 * per-kind limit is checked once the type is known.
 */
export function assetUploadCapBytes(): number {
  return Math.max(maxAssetBytes("video/mp4"), maxAssetBytes("audio/mpeg"), maxAssetBytes("application/pdf"));
}

/** 413 for an upload multer refused as too large, reporting the limit it enforced. */
export class UploadTooLargeException extends PayloadTooLargeException {
  constructor() {
    super(`File must be ${maxImageBytes()} bytes or smaller.`);
  }
}

/**
 * Files live under the three configured roots. Each root is resolved once, so a path this service
 * hands out is the absolute path `res.sendFile` needs — a configured absolute root would otherwise be
 * joined onto the process directory again.
 */
@Injectable()
export class LocalStorageService {
  private readonly avatarRoot = resolve(process.env.UPLOADS_PATH ?? "uploads/avatars");
  private readonly imageRoot = resolve(process.env.IMAGES_PATH ?? "uploads/images");
  private readonly assetRoot = resolve(process.env.ASSETS_PATH ?? "uploads/assets");

  async saveAvatar(file: Express.Multer.File) {
    await mkdir(this.avatarRoot, { recursive: true });

    const extension = this.imageExtensionFor(file);
    const fileId = `${randomUUID()}${extension}`;
    await writeFile(join(this.avatarRoot, fileId), file.buffer);

    return fileId;
  }

  async removeAvatar(fileId: string) {
    await rm(this.avatarPath(fileId), { force: true });
  }

  avatarPath(fileId: string) {
    return this.storedFile(this.avatarRoot, fileId, "Avatar not found.");
  }

  async saveImage(file: Express.Multer.File) {
    await mkdir(this.imageRoot, { recursive: true });

    const extension = this.imageExtensionFor(file);
    const fileId = `${randomUUID()}${extension}`;
    await writeFile(join(this.imageRoot, fileId), file.buffer);

    return fileId;
  }

  async removeImage(fileId: string) {
    await rm(this.imagePath(fileId), { force: true });
  }

  imagePath(fileId: string) {
    return this.storedFile(this.imageRoot, fileId, "Image not found.");
  }

  async saveAsset(file: Express.Multer.File) {
    const extension = this.assetExtensionFor(file);
    await mkdir(this.assetRoot, { recursive: true });

    const fileId = `${randomUUID()}${extension}`;
    await writeFile(join(this.assetRoot, fileId), file.buffer);

    return fileId;
  }

  async removeAsset(fileId: string) {
    await rm(this.assetPath(fileId), { force: true });
  }

  assetPath(fileId: string) {
    return this.storedFile(this.assetRoot, fileId, "Asset not found.");
  }

  /**
   * The absolute path of a stored file. Only a plain file name is one: a separator, or `.`/`..`,
   * would resolve outside the root, and `rm` on the directory that comes back throws.
   */
  private storedFile(root: string, fileId: string, missing: string) {
    if (!fileId || fileId === "." || fileId === ".." || fileId.includes("/") || fileId.includes("\\"))
      throw new NotFoundException(missing);

    return join(root, fileId);
  }

  /** The stored extension of a supported image, or a refusal: an unknown type has none here. */
  private imageExtensionFor(file: Express.Multer.File): string {
    const extension = IMAGE_MIME_EXTENSIONS[file.mimetype];
    if (!extension) throw new BadRequestException("Unsupported image type.");

    return extension;
  }

  private assetExtensionFor(file: Express.Multer.File): string {
    if (!isAssetMimeType(file.mimetype)) throw new BadRequestException("Unsupported asset type.");

    return ASSET_MIME_EXTENSIONS[file.mimetype as keyof typeof ASSET_MIME_EXTENSIONS];
  }
}
