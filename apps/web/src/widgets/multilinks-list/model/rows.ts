import type { Link, LinkStatus, OverviewLinkRow } from "~shared/api/backend";

/** One line of the owner's table: the page's own facts, and the numbers the overview counts for it. */
export interface LinksListRow {
  id: string;
  title: string;
  slug: string;
  status: LinkStatus;
  updatedAt: string;
  clicks: number;
  visitors: number;
}

/**
 * The owner's pages in their own order, each carrying the metrics the overview counted for it. A page the
 * overview has no rows for reads as zeros — "nobody has read it yet" is a fact, while a blank cell is a
 * question.
 */
export function linksRows(links: Link[], metrics: OverviewLinkRow[]): LinksListRow[] {
  const byId = new Map(metrics.map((row) => [row.id, row]));

  return links.map((link) => ({
    id: link.id,
    title: link.title,
    slug: link.slug,
    status: link.status,
    updatedAt: link.updatedAt,
    clicks: byId.get(link.id)?.clicks ?? 0,
    visitors: byId.get(link.id)?.visitors ?? 0,
  }));
}
