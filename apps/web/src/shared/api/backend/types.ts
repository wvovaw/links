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

/** What a page's blocks have earned: one row per block that saw at least one event. */
export interface BlockStats {
  blockId: string;
  clicks: number;
  views: number;
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
