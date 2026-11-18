import type { SourceColumns } from "./source";

import { mediumOfHost } from "./source";

/** Everything a dashboard card prints, in the shape both read endpoints answer with. */
export interface StatsTotals {
  views: number;
  visitors: number;
  clicks: number;
}

/** One day of a series. Days with no events are absent here; the client fills them. */
export interface StatsPoint {
  date: string;
  views: number;
  visitors: number;
  clicks: number;
}

export interface StatsSource {
  source: string;
  medium: string;
  views: number;
  visitors: number;
  clicks: number;
}

export interface BlockClicks {
  blockId: string;
  clicks: number;
  visitors: number;
}

export interface LinkStats {
  totals: StatsTotals;
  /** The same cards read over the window before this one, so they can print a delta; `null` when unbounded. */
  previous: StatsTotals | null;
  timeseries: StatsPoint[];
  sources: StatsSource[];
  blocks: BlockClicks[];
}

export interface OverviewLinkRow {
  id: string;
  slug: string;
  title: string;
  views: number;
  visitors: number;
  clicks: number;
}

export interface OverviewStats {
  totals: StatsTotals;
  previous: StatsTotals | null;
  timeseries: StatsPoint[];
  sources: StatsSource[];
  links: OverviewLinkRow[];
}

export interface SourceLabel {
  source: string;
  medium: string;
}

/**
 * What the dashboard prints for one group of rows: the utm tag if the link carried one, otherwise the host
 * the visitor came from, otherwise the site's own navigation, otherwise nothing at all.
 *
 * It runs on read, over the raw facts the table stores, so the host lists can grow tomorrow and every row
 * recorded today re-labels itself with no migration.
 */
export function classifySource(columns: SourceColumns): SourceLabel {
  if (columns.utmSource) return { source: columns.utmSource, medium: columns.utmMedium ?? "referral" };
  if (columns.referrerHost) return { source: columns.referrerHost, medium: mediumOfHost(columns.referrerHost) };
  if (columns.referrerInternal) return { source: "internal", medium: "internal" };

  return { source: "direct", medium: "direct" };
}
