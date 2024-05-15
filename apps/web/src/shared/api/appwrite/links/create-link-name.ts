import { useDatabaseApi } from "../instance";
import { getErrorMessage } from "../errors";
import { ApiException } from "../types";
import { LINKS_NAMES_COLLECTION_ID } from "../constants";

export interface ICreateLinkNameData {
  link_name: string;
};

export async function createLinkName({ link_name }: ICreateLinkNameData) {
  try {
    const db = useDatabaseApi();
    const config = useRuntimeConfig();

    await db.createDocument(
      config.public.appwriteDatabaseId,
      LINKS_NAMES_COLLECTION_ID,
      link_name, // use user provided link_name as a document id to make sure it is unique
      {
        link: null
      },
    );
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
