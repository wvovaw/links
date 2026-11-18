import type { Link, OverviewLinkRow } from "~shared/api/backend";

import { describe, expect, it } from "vitest";
import { LinkStatus } from "~shared/api/backend";

import { linksRows } from "./rows";

function page(id: string, slug: string): Link {
  return {
    id,
    slug,
    title: `Page ${slug}`,
    blocks: [],
    seo: {},
    background: "",
    theme: null,
    status: LinkStatus.PUBLISHED,
    updatedAt: "2026-11-08T00:00:00.000Z",
  };
}

function overviewRow(id: string, clicks: number, visitors: number): OverviewLinkRow {
  return { id, slug: "blog", title: "Blog", views: 9, visitors, clicks, spark: [] };
}

describe("linksRows", () => {
  it("keeps the list's order and folds in each page's own metrics", () => {
    const rows = linksRows([page("a", "my-page"), page("b", "blog")], [overviewRow("b", 3, 4)]);

    expect(rows.map((row) => row.slug)).toEqual(["my-page", "blog"]);
    expect(rows[1]).toEqual({
      id: "b",
      slug: "blog",
      title: "Page blog",
      status: LinkStatus.PUBLISHED,
      updatedAt: "2026-11-08T00:00:00.000Z",
      clicks: 3,
      visitors: 4,
    });
  });

  /* A page nobody has read yet: zeros, not a blank cell the reader has to interpret. */
  it("reads a page the overview has no numbers for as zeros", () => {
    const [row] = linksRows([page("a", "my-page")], []);

    expect(row).toMatchObject({ clicks: 0, visitors: 0 });
  });
});
