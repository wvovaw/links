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
