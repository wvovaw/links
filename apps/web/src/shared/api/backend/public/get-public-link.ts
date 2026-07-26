import { useApiClient } from "../client";
import type { PublicLink } from "../types";

export async function getPublicLink(slug: string): Promise<PublicLink | null> {
  const api = useApiClient();
  return api<PublicLink>(`/public/links/${slug}`);
}
