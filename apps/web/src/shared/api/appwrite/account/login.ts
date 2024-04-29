import { getErrorMessage } from "../errors";
import { useAccountApi } from "../instance";
import { ApiException, type Session } from "../types";

export interface IUserLoginData {
  email: string;
  password: string;
}

export async function login({ email, password }: IUserLoginData): Promise<Session | undefined> {
  try {
    const api = useAccountApi();
    const data = await api.createEmailPasswordSession(email, password);
    return data;
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
