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

/** What an `<img src>` gets: the url as stored, or the file id resolved against the storage origin. */
export function resolveBlockImageUrl(
  value: string | undefined | null,
  options: StorageApi.StorageUrlOptions,
): string | undefined {
  if (!value) return undefined;
  return isAbsoluteImageUrl(value) ? value : StorageApi.resolveImageUrl(value, options);
}
