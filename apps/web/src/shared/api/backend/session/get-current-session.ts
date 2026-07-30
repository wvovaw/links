import type { User } from "../types";

import { useApiClient } from "../client";
import { getErrorMessage } from "../errors";
import { normalizeUser } from "../mappers";

export async function getCurrentSession(): Promise<User | null> {
  const config = useRuntimeConfig();
  try {
    const api = useApiClient();
    const data = await api<User>("/auth/session");
    return normalizeUser(data, { origin: config.public.backendUrl });
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("401")) {
      return null;
    }
    throw new Error(getErrorMessage("user_unauthorized"), { cause: e });
  }
}
