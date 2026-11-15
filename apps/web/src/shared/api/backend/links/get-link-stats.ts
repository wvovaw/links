import type { BlockStats } from "../types";

import { useApiClient } from "../client";

/**
 * The counters a page's blocks have collected. A page with no events, an unreachable API and a session
 * that has expired all read as "nothing counted yet": the panel shows zeros rather than an error.
 */
export async function getLinkStats(id: string): Promise<BlockStats[]> {
  try {
    const api = useApiClient();
    const { blocks } = await api<{ blocks: BlockStats[] }>(`/links/${id}/stats`);

    return blocks;
  } catch {
    return [];
  }
}
