import { ApiException, type ILinkPageDocument, LinksApi } from "~shared/api/appwrite";
import { getErrorMessage } from "~shared/api/appwrite/errors";

export default async function ({ link_name, title }: { link_name: string; title: string }): Promise<ILinkPageDocument | undefined> {
  try {
    const name = await LinksApi.createLinkName({ link_name });

    if (name) {
      const newLink = await LinksApi.createLink({ title, name_document_id: name.$id });
      return newLink;
    }

    return undefined;
  }
  catch (e: unknown) {
    if (e instanceof ApiException)
      throw new Error(getErrorMessage(e.type));
  }
}
