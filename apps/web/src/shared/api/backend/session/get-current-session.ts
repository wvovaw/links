import { getErrorMessage } from "../errors";
import { useApiClient } from "../client";
import type { User } from "../types";

export async function getCurrentSession(): Promise<User | null> {
  try {
    const api = useApiClient();
    const data = await api<User>("/auth/session");
    return data;
  }
  catch (e: unknown) {
    if (e instanceof Error && e.message.includes("401")) {
      return null;
    }
    throw new Error(getErrorMessage("user_unauthorized"));
  }
}
