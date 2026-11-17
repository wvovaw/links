import type { PageTheme } from "@links/blocks";

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerification: boolean;
  avatarUrl?: string;
}

export interface Link {
  id: string;
  slug: string;
  title: string;
  blocks: unknown[];
  seo: Record<string, unknown>;
  /** Legacy pages only: the raw client-authored CSS a page published before themes keeps. */
  background: string;
  theme: PageTheme | null;
  status: LinkStatus;
}

export interface PublicLink {
  title: string;
  slug: string;
  blocks: unknown[];
  seo: Record<string, unknown>;
  /** Legacy pages only: the raw client-authored CSS a page published before themes keeps. */
  background: string;
  theme: PageTheme | null;
}

export enum LinkStatus {
  FRESH = "FRESH",
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

/** One page's totals over the window the caller asked about. */
export interface StatsTotals {
  views: number;
  visitors: number;
  clicks: number;
}

/** One day of a series. Days with no events are absent here; the client fills the range it asked for. */
export interface StatsPoint {
  date: string;
  views: number;
  visitors: number;
  clicks: number;
}

/** One traffic source, as the dashboard prints it: a utm tag, a host, or nothing at all. */
export interface StatsSource {
  source: string;
  medium: string;
  views: number;
  visitors: number;
  clicks: number;
}

/** What a page's blocks have earned: one row per block that saw at least one click. */
export interface BlockStats {
  blockId: string;
  clicks: number;
  visitors: number;
}

/** One page's statistics. */
export interface LinkStats {
  totals: StatsTotals;
  timeseries: StatsPoint[];
  sources: StatsSource[];
  blocks: BlockStats[];
}

/** One page's row on the home dashboard. */
export interface OverviewLinkRow {
  id: string;
  slug: string;
  title: string;
  views: number;
  visitors: number;
  clicks: number;
}

/** Everything the home dashboard shows: the owner's pages together, and one row each. */
export interface OverviewStats {
  totals: StatsTotals;
  timeseries: StatsPoint[];
  sources: StatsSource[];
  links: OverviewLinkRow[];
}

/** The window a caller asks about; an absent bound is unbounded on that side. */
export interface StatsRange {
  from?: string;
  to?: string;
}

/** What a visitor filled in: the fields their form asked for, and nothing else. */
export interface FormSubmissionPayload {
  email: string;
  name?: string;
  message?: string;
}

/** One row of a page's form submissions, as its owner reads them. */
export interface FormSubmission {
  id: string;
  blockId: string;
  kind: "contact" | "subscribe";
  payload: FormSubmissionPayload;
  createdAt: string;
}
