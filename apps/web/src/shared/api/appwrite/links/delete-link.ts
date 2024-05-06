import { useDatabaseApi } from "../instance";
import { getErrorMessage } from "../errors";
import { ApiException } from "../types";
import { LINKS_COLLECTION_ID } from "./constants";

export async function deleteLink(id: string) {
  try {
    const db = useDatabaseApi();
    const config = useRuntimeConfig();

    await db.deleteDocument(
      config.public.appwriteDatabaseId,
      LINKS_COLLECTION_ID,
      id,
    );
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
