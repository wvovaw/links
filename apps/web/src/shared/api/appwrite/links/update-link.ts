import { useDatabaseApi } from "../instance";
import { getErrorMessage } from "../errors";
import { ApiException } from "../types";
import { LINKS_COLLECTION_ID } from "./constants";

export interface IUpdateLinkData {
  id: string;
  title: string;
  blocks: Record<string, any>[];
  seo: Record<string, any>;
};

export async function updateLink({ id, title, blocks, seo }: IUpdateLinkData) {
  try {
    const db = useDatabaseApi();
    const config = useRuntimeConfig();

    await db.updateDocument(
      config.public.appwriteDatabaseId,
      LINKS_COLLECTION_ID,
      id,
      {
        title,
        blocks: JSON.stringify(blocks),
        seo: JSON.stringify(seo),
      },
    );
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
