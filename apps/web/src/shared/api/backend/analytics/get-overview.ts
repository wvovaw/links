import type { OverviewStats, StatsRange } from "../types";

import { useApiClient } from "../client";

export interface OverviewResult {
  /** Null only when the request failed; an owner with no pages arrives as an empty list, not as null. */
  stats: OverviewStats | null;
  /** True when the request failed outright, which the dashboard reports instead of drawing zeros. */
  failed: boolean;
}

/** The home dashboard: every page the caller owns, together and one row each. */
export async function getOverview(range: StatsRange = {}): Promise<OverviewResult> {
  try {
    const api = useApiClient();
    const stats = await api<OverviewStats>("/analytics/overview", { query: range });

    return { stats, failed: false };
  } catch {
    return { stats: null, failed: true };
  }
}
