import { getErrorMessage } from "./errors";
import {
  ApiException,
  useAccountApi,
} from "~shared/api/appwrite";

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
