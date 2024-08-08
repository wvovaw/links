import { getErrorMessage } from "../errors";
import { useAccountApi } from "../instance";
import { ApiException } from "../types";

export async function logout() {
  try {
    const api = useAccountApi();
    await api.deleteSession("current");
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
