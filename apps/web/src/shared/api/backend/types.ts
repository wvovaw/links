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
  background: string;
  status: LinkStatus;
}

export interface PublicLink {
  title: string;
  slug: string;
  blocks: unknown[];
  seo: Record<string, unknown>;
  background: string;
}

export enum LinkStatus {
  FRESH = "FRESH",
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}
