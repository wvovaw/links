import { useDatabaseApi } from "../instance";
import type { ILinkPageDocument } from "../types";
import { LINKS_COLLECTION_ID } from "./constants";

export async function listLinks() {
  const db = useDatabaseApi();
  const config = useRuntimeConfig();

  const data = await db.listDocuments<ILinkPageDocument>(
    config.public.appwriteDatabaseId,
    LINKS_COLLECTION_ID,
  );
  return data;
}
