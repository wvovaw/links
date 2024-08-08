import { getErrorMessage } from "../errors";
import { useAccountApi } from "../instance";
import { ApiException, type Session } from "../types";

export async function getCurrentSession(): Promise<Session | null | undefined> {
  try {
    const api = useAccountApi();
    const data = await api.getSession("current");
    return data;
  }
  catch (e: unknown) {
    if (e instanceof ApiException) {
      if (e.code === 401) // Unauthorized
        return null;
      else throw new Error(getErrorMessage(e.type));
    }
  }
}
