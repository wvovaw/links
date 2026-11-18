import type { ActivityItem } from "../types";

import { useApiClient } from "../client";

export interface ActivityResult {
  /** Empty when the request failed; an owner with no events arrives as an empty list, not as a failure. */
  items: ActivityItem[];
  /** True when the request failed outright, which the dashboard reports instead of an empty feed. */
  failed: boolean;
}

/** The live feed: the newest views and clicks across the caller's pages, newest first. */
export async function getActivity(limit = 10): Promise<ActivityResult> {
  try {
    const api = useApiClient();
    const { items } = await api<{ items: ActivityItem[] }>("/analytics/activity", { query: { limit } });

    return { items, failed: false };
  } catch {
    return { items: [], failed: true };
  }
}
