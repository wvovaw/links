import type { User } from "../types";

import { useApiClient } from "../client";
import { getErrorMessage } from "../errors";

export async function removeAvatar(): Promise<User | undefined> {
  try {
    const api = useApiClient();
    const data = await api<User>("/users/me/avatar", {
      method: "DELETE",
    });
    return data;
  } catch {
    throw new Error(getErrorMessage("unknown"));
  }
}
