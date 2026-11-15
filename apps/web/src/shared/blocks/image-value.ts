import { StorageApi } from "~shared/api/backend";

/**
 * An `image` property holds either a storage file id, which is what the uploader writes, or a url
 * pasted by the owner before the block had an uploader (a migrated Avatar). Only the file id may be
 * resolved against the backend or handed to it as an existing file.
 */
const ABSOLUTE_URL = /^https?:\/\//;

export function isAbsoluteImageUrl(value: string): boolean {
  return ABSOLUTE_URL.test(value);
}

/**
 * Whether an `image` property (or a list's image item field) holds an uploaded asset rather than an
 * image. The property's own `accept` decides: a field that offers a video, an audio clip or a pdf
 * goes through the asset endpoint, which owns the mimetype allowlist, while a field that offers any
 * image type stays an image. Both the uploader and the save use this one rule.
 */
export function storesAsset(accept?: string): boolean {
  return !(accept ?? "image/*").split(",").some((type) => type.trim().startsWith("image/"));
}

/** What an `<img src>` gets: the url as stored, or the file id resolved against the storage origin. */
export function resolveBlockImageUrl(
  value: string | undefined | null,
  options: StorageApi.StorageUrlOptions,
): string | undefined {
  if (!value) return undefined;
  return isAbsoluteImageUrl(value) ? value : StorageApi.resolveImageUrl(value, options);
}
