import { getErrorMessage } from "../errors";
import { setRefreshToken, useApiClient } from "../client";
import type { User } from "../types";

export interface IUserLoginData {
  email: string;
  password: string;
}

export async function login({ email, password }: IUserLoginData): Promise<User | undefined> {
  try {
    const api = useApiClient();
    const data = await api<{ user: User; refreshToken: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setRefreshToken(data.refreshToken);
    return data.user;
  }
  catch {
    throw new Error(getErrorMessage("user_invalid_credentials"));
  }
}
