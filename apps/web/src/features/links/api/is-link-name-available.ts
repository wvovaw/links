import { LinksApi } from "~shared/api/backend";

export default async function (slug: string): Promise<boolean> {
  try {
    return await LinksApi.isSlugAvailable(slug);
  }
  catch {
    return false;
  }
}
