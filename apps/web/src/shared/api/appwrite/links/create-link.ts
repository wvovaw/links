import { ID } from "appwrite";
import { useDatabaseApi } from "../instance";
import { getErrorMessage } from "../errors";
import { ApiException } from "../types";
import { LINKS_COLLECTION_ID } from "./constants";

export interface ICreateLinkData {
  title: string;
  blocks: Record<string, any>[];
  seo: Record<string, any>;
};

export async function createLink({ title, blocks, seo }: ICreateLinkData) {
  try {
    const db = useDatabaseApi();
    const config = useRuntimeConfig();

    await db.createDocument(
      config.public.appwriteDatabaseId,
      LINKS_COLLECTION_ID,
      ID.unique(),
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
