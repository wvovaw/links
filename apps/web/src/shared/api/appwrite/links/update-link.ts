import { useDatabaseApi } from "../instance";
import { getErrorMessage } from "../errors";
import { ApiException } from "../types";
import { LINKS_COLLECTION_ID } from "../constants";

export interface IUpdateLinkData {
  id: string;
  title: string;
  blocks: Record<string, any>[];
  seo: Record<string, any>;
  background: string;
};

export async function updateLink({ id, title, blocks, seo, background }: IUpdateLinkData) {
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
        background,
      },
    );
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
