import { getErrorMessage } from "./errors";
import {
  ApiException,
  type Session,
  useAccountApi,
} from "~shared/api/appwrite";

export async function getCurrentSession(): Promise<Session | undefined> {
  try {
    const api = useAccountApi();
    const data = await api.getSession("current");
    return data;
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
