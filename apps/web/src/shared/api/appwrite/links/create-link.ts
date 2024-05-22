import { ID } from "appwrite";
import { useDatabaseApi } from "../instance";
import { getErrorMessage } from "../errors";
import { ApiException, type ILinkNameDocument, type ILinkPageDocument } from "../types";
import { LINKS_COLLECTION_ID } from "../constants";

export interface ICreateLinkData {
  title: string;
  name_document_id: ILinkNameDocument["$id"];
  blocks?: Record<string, any>[];
  seo?: Record<string, any>;
  background?: string;
};

export async function createLink({ title, background, blocks = [], seo = {}, name_document_id }: ICreateLinkData): Promise<ILinkPageDocument | undefined> {
  try {
    const db = useDatabaseApi();
    const config = useRuntimeConfig();

    const res = await db.createDocument<ILinkPageDocument>(
      config.public.appwriteDatabaseId,
      LINKS_COLLECTION_ID,
      ID.unique(),
      {
        title,
        blocks: JSON.stringify(blocks),
        seo: JSON.stringify(seo),
        background,
        name: name_document_id,
      },
    );
    return res;
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
