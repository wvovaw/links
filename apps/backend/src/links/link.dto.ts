import type { PageTheme } from "@links/blocks";

import { Link } from "./link.entity";

export interface LinkDto {
  id: string;
  slug: string;
  title: string;
  blocks: unknown[];
  seo: Record<string, unknown>;
  /** Legacy pages only: raw client-authored CSS, kept for pages published before themes existed. */
  background: string;
  theme: PageTheme | null;
  status: string;
}

export function toLinkDto(link: Link): LinkDto {
  return {
    id: link.id,
    slug: link.slug,
    title: link.title,
    blocks: link.blocks,
    seo: link.seo,
    background: link.background,
    theme: link.theme ?? null,
    status: link.status,
  };
}

export function toPublicLinkDto(link: Link) {
  return {
    title: link.title,
    slug: link.slug,
    blocks: link.blocks,
    seo: link.seo,
    background: link.background,
    theme: link.theme ?? null,
  };
}
