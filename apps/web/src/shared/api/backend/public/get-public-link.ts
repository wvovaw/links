import type { PublicLink } from "../types";

export async function getPublicLink(slug: string): Promise<PublicLink | null> {
  try {
    const config = useRuntimeConfig();
    const data = await $fetch<PublicLink>(`/public/links/${slug}`, {
      baseURL: config.public.backendUrl,
    });
    return data;
  }
  catch {
    return null;
  }
}
