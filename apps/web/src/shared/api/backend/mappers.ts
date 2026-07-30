import type { User } from "./types";

import { type StorageUrlOptions, resolveStorageUrl } from "./storage/url";

export function normalizeUser(user: User, options: StorageUrlOptions): User {
  return {
    ...user,
    avatarUrl: resolveStorageUrl(user.avatarUrl, options),
  };
}
