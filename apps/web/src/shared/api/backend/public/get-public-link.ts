import type { PublicLink } from "../types";

import { useApiClient } from "../client";

export async function getPublicLink(slug: string): Promise<PublicLink | null> {
  const api = useApiClient();
  return api<PublicLink>(`/public/links/${slug}`);
}
