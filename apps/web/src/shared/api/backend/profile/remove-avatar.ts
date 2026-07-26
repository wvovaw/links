import { getErrorMessage } from "../errors";
import { useApiClient } from "../client";
import type { User } from "../types";

export async function removeAvatar(): Promise<User | undefined> {
  try {
    const api = useApiClient();
    const data = await api<User>("/users/me/avatar", {
      method: "DELETE",
    });
    return data;
  }
  catch {
    throw new Error(getErrorMessage("unknown"));
  }
}
