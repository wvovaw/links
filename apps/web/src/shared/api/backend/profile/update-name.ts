import { getErrorMessage } from "../errors";
import { useApiClient } from "../client";
import type { User } from "../types";

export interface IUserUpdateNameData {
  name: string;
}

export async function updateName({ name }: IUserUpdateNameData): Promise<User | undefined> {
  try {
    const api = useApiClient();
    const data = await api<User>("/users/me", {
      method: "PATCH",
      body: { name },
    });
    return data;
  }
  catch {
    throw new Error(getErrorMessage("unknown"));
  }
}
