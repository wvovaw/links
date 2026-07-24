import { getErrorMessage } from "../errors";
import { setRefreshToken, useApiClient } from "../client";
import type { User } from "../types";

export interface IUserRegisterData {
  email: string;
  username: string;
  password: string;
}

export async function register({ email, username, password }: IUserRegisterData): Promise<User | undefined> {
  try {
    const api = useApiClient();
    const data = await api<{ user: User; refreshToken: string }>("/auth/register", {
      method: "POST",
      body: { email, name: username, password },
    });
    setRefreshToken(data.refreshToken);
    return data.user;
  }
  catch {
    throw new Error(getErrorMessage("user_already_exists"));
  }
}
