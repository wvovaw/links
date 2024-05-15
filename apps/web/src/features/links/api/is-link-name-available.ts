import { LinksApi } from "~shared/api/appwrite";

// TODO: replace this by Appwrite lambda function
export default async function (link_name: string): Promise<boolean> {
  try {
    const data = await LinksApi.getLinkName(link_name);

    if (data)
      return false;
    else return true;
  }
  catch (e: unknown) {
    return false;
  }
}
