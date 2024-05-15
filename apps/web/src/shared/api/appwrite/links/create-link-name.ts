import { useDatabaseApi } from "../instance";
import { getErrorMessage } from "../errors";
import { ApiException, type ILinkNameDocument } from "../types";
import { LINKS_NAMES_COLLECTION_ID } from "../constants";

export interface ICreateLinkNameData {
  link_name: string;
};

export async function createLinkName({ link_name }: ICreateLinkNameData): Promise<ILinkNameDocument | undefined> {
  try {
    const db = useDatabaseApi();
    const config = useRuntimeConfig();

    const res = await db.createDocument<ILinkNameDocument>(
      config.public.appwriteDatabaseId,
      LINKS_NAMES_COLLECTION_ID,
      link_name, // use user provided link_name as a document id to make sure it is unique
      {
        link: null,
      },
    );
    return res;
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
