import { getErrorMessage } from "../errors";
import { setRefreshToken, useApiClient } from "../client";
import { normalizeUser } from "../mappers";
import type { User } from "../types";

export interface IUserRegisterData {
  email: string;
  username: string;
  password: string;
}

export async function register({ email, username, password }: IUserRegisterData): Promise<User | undefined> {
  const config = useRuntimeConfig();
  try {
    const api = useApiClient();
    const data = await api<{ user: User; refreshToken: string }>("/auth/register", {
      method: "POST",
      body: { email, username, password },
    });
    setRefreshToken(data.refreshToken);
    return normalizeUser(data.user, { origin: config.public.backendUrl });
  }
  catch {
    throw new Error(getErrorMessage("user_already_exists"));
  }
}
