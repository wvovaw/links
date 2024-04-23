import { getErrorMessage } from "./errors";
import {
  ApiException,
  type User,
  useAccountApi,
} from "~shared/api/appwrite";

export async function getCurrentUser(): Promise<User | undefined> {
  try {
    const api = useAccountApi();
    const data = await api.get();
    return data;
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
