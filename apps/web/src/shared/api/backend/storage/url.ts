export interface StorageUrlOptions {
  /** Storage origin, e.g. `config.public.backendUrl`. */
  origin: string;
}

export function resolveStorageUrl(path: string | undefined | null, options: StorageUrlOptions): string | undefined {
  if (!path) return path ?? undefined;
  return path.startsWith("/") ? `${options.origin}${path}` : path;
}

export function resolveImageUrl(fileId: string | undefined | null, options: StorageUrlOptions): string | undefined {
  if (!fileId) return undefined;
  return `${options.origin}/storage/images/${fileId}`;
}

/** A video, an audio clip or a pdf, served from the asset endpoint. */
export function resolveAssetUrl(fileId: string | undefined | null, options: StorageUrlOptions): string | undefined {
  if (!fileId) return undefined;
  return `${options.origin}/storage/assets/${fileId}`;
}
