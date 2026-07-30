import type { User } from "../types";

import { setRefreshToken, useApiClient } from "../client";
import { getErrorMessage } from "../errors";
import { normalizeUser } from "../mappers";

export interface IUserLoginData {
  email: string;
  password: string;
}

export async function login({ email, password }: IUserLoginData): Promise<User | undefined> {
  const config = useRuntimeConfig();
  try {
    const api = useApiClient();
    const data = await api<{ user: User; refreshToken: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setRefreshToken(data.refreshToken);
    return normalizeUser(data.user, { origin: config.public.backendUrl });
  } catch {
    throw new Error(getErrorMessage("user_invalid_credentials"));
  }
}
