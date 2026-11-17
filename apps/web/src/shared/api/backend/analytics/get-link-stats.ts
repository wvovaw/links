import type { LinkStats, StatsRange } from "../types";

import { useApiClient } from "../client";

export interface LinkStatsResult {
  /** Null only when the request failed; an empty page arrives as a full shape of zeros. */
  stats: LinkStats | null;
  /**
   * True when the list could not be read at all — an unreachable API, or a session that has expired. It is
   * not the same answer as zeros: "nobody visited" and "we could not ask" are different facts, and a
   * dashboard that shows the wrong one is worse than one that shows nothing.
   */
  failed: boolean;
}

/** One page's statistics over the window the caller asks about. */
export async function getLinkStats(id: string, range: StatsRange = {}): Promise<LinkStatsResult> {
  try {
    const api = useApiClient();
    const stats = await api<LinkStats>(`/analytics/links/${id}`, { query: range });

    return { stats, failed: false };
  } catch {
    return { stats: null, failed: true };
  }
}
