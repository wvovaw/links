import { getErrorMessage } from "../errors";
import { useAccountApi } from "../instance";
import { ApiException, type Session } from "../types";

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
