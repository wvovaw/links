import { getErrorMessage } from "./errors";
import {
  ApiException,
  ID,
  useAccountApi,
} from "~shared/api/appwrite";

export interface IUserRegisterData {
  email: string;
  username: string;
  password: string;
}

export async function register({ email, username, password }: IUserRegisterData): Promise<unknown> {
  try {
    const api = useAccountApi();
    const data = await api.create(ID.unique(), email, password, username);
    return data;
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
