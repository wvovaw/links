import type { User } from "../types";

import { useApiClient } from "../client";
import { getErrorMessage } from "../errors";
import { normalizeUser } from "../mappers";

export interface IUserUpdateAvatarData {
  file: File;
}

export async function updateAvatar({ file }: IUserUpdateAvatarData): Promise<User | undefined> {
  const config = useRuntimeConfig();
  try {
    const api = useApiClient();
    const formData = new FormData();
    formData.append("avatar", file);

    const data = await api<User>("/users/me/avatar", {
      method: "PUT",
      body: formData,
    });
    return normalizeUser(data, { origin: config.public.backendUrl });
  } catch {
    throw new Error(getErrorMessage("unknown"));
  }
}
