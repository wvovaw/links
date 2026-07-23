import { Link } from "./link.entity";

export interface LinkDto {
  id: string;
  slug: string;
  title: string;
  blocks: unknown[];
  seo: Record<string, unknown>;
  background: string;
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
  };
}
