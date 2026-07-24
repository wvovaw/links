import { LinksApi } from "~shared/api/backend";
import type { Link } from "~shared/api/backend";

export default async function ({ slug, title }: { slug: string; title: string }): Promise<Link | undefined> {
  try {
    const newLink = await LinksApi.createLink({ slug, title });
    return newLink;
  }
  catch (e: unknown) {
    if (e instanceof Error)
      throw e;
  }
}
