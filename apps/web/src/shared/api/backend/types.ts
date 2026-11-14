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
