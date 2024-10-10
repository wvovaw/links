import { useDatabaseApi } from "../instance";
import { getErrorMessage } from "../errors";
import type { LinkPublishStatus } from "../types";
import { ApiException } from "../types";
import { LINKS_COLLECTION_ID } from "../constants";

export interface IUpdateLinkData {
  id: string;
  title: string;
  blocks: Record<string, any>[];
  seo: Record<string, any>;
  background: string;
  status: LinkPublishStatus;
};

export async function updateLink({ id, title, blocks, seo, background, status }: IUpdateLinkData) {
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
        status,
      },
    );
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
