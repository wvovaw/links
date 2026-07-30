import { useApiClient } from "../client";

export async function isSlugAvailable(slug: string): Promise<boolean> {
  try {
    const api = useApiClient();
    const data = await api<{ available: boolean }>(`/links/slug/${slug}/availability`);
    return data.available;
  } catch {
    return false;
  }
}
