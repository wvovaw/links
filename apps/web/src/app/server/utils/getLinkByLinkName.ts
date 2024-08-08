import useAppwriteClient from "./appwriteClient";
import type { ILinkNameDocument, ILinkPageDocument } from "~shared/api/appwrite";
import { LINKS_NAMES_COLLECTION_ID } from "~shared/api/appwrite/constants";

export async function getLinkByLinkName(linkName: string): Promise<ILinkPageDocument | null> {
  const api = useAppwriteClient();
  const config = useRuntimeConfig();
  const db_id = config.public.appwriteDatabaseId;
  const links_names_collection_id = LINKS_NAMES_COLLECTION_ID;

  try {
    const link_name = await api<ILinkNameDocument>(`/databases/${db_id}/collections/${links_names_collection_id}/documents/${linkName}`);
    const link = link_name.link;
    if (link)
      return link_name.link;
    else return null;
  }
  catch (e: unknown) {
    return null;
  }
}
