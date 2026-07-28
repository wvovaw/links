import { type StorageUrlOptions, resolveStorageUrl } from "./storage/url";
import type { User } from "./types";

export function normalizeUser(user: User, options: StorageUrlOptions): User {
  return {
    ...user,
    avatarUrl: resolveStorageUrl(user.avatarUrl, options),
  };
}
