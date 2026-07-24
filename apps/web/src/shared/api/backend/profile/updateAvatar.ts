import { getErrorMessage } from "../errors";
import { useApiClient } from "../client";
import type { User } from "../types";

export interface IUserUpdateAvatarData {
  file: File;
}

export async function updateAvatar({ file }: IUserUpdateAvatarData): Promise<User | undefined> {
  try {
    const api = useApiClient();
    const formData = new FormData();
    formData.append("avatar", file);

    const data = await api<User>("/users/me/avatar", {
      method: "PUT",
      body: formData,
    });
    return data;
  }
  catch {
    throw new Error(getErrorMessage("unknown"));
  }
}
