import { useDatabaseApi } from "../instance";
import { getErrorMessage } from "../errors";
import { ApiException, type ILinkNameDocument } from "../types";
import { LINKS_NAMES_COLLECTION_ID } from "../constants";

export async function getLinkName(id: ILinkNameDocument["$id"]): Promise<ILinkNameDocument | undefined> {
  try {
    const db = useDatabaseApi();
    const config = useRuntimeConfig();

    const linkName = await db.getDocument<ILinkNameDocument>(
      config.public.appwriteDatabaseId,
      LINKS_NAMES_COLLECTION_ID,
      id,
    );
    return linkName;
  }
  catch (e: unknown) {
    if (e instanceof ApiException) {
      if (e.code === 404)
        return undefined;
      else throw new Error(getErrorMessage(e.type));
    }
  }
}
