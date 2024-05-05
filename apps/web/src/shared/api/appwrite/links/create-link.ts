import { ID } from "appwrite";
import { useDatabaseApi } from "../instance";
import { LINKS_COLLECTION_ID } from "./constants";

export interface ICreateLinkData {
  title: string;
  blocks: Record<string, any>[];
  seo: Record< string, any>;
};

export async function createLink({ title, blocks, seo }: ICreateLinkData) {
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
