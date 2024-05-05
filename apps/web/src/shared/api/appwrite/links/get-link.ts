import { useDatabaseApi } from "../instance";
import { getErrorMessage } from "../errors";
import { ApiException, type ILinkPageDocument } from "../types";
import { LINKS_COLLECTION_ID } from "./constants";

export async function getLink(id: ILinkPageDocument["$id"]): Promise<ILinkPageDocument | undefined> {
  try {
    const db = useDatabaseApi();
    const config = useRuntimeConfig();

    const link = await db.getDocument<ILinkPageDocument>(
      config.public.appwriteDatabaseId,
      LINKS_COLLECTION_ID,
      id,
    );
    return link;
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
