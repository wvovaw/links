# The links page as a dashboard

## Why

`/links` is the screen an owner opens to see what they have made, and it answers nothing: a bare table of
title, slug and status, five buttons per row, no numbers. The mockup that started this describes the same
screen as a dashboard — the portfolio's numbers on top, the pages with their own numbers below. The home
screen (`IndexPage`) already answers "is this page worth keeping" for the portfolio; this makes the list of
pages answer it per page, where the owner is actually looking.

## Goals

1. A header: the page's icon, "Links", a one-line subtitle, and the range picker — 30 days by default.
2. Four metric cards (clicks, visitors, CTR, views), each with its delta against the previous period and a
   sparkline of the chosen range.
3. A "Your Links" card: a Create Link action, a table (the page with its slug and status, the public link
   with a copy button, clicks, visitors, the time it was last updated, the row's actions), and a footer that
   pages the table and sets how many rows a page holds.
4. Both themes read correctly, from the kit's semantic tokens only. The mockup's dark look is this app in its
   dark theme — nothing here names a colour that only reads in one of them.
5. The "Updated" column is the page's own update time from the API, not a time the client made up.

## Non-goals

- **No page thumbnails.** Nothing in the product produces a page preview image. The first cell gets a
  monogram tile, which is the same stand-in the analytics spec chose for its rows.
- **No per-row sparkline.** The mockup has none; the per-page performance list in the analytics spec keeps
  that job.
- **No server-side pagination.** `GET /links` and the overview both answer the owner's whole list, and the
  footer pages what has already arrived.
- **No second widget set.** The metric cards, the range picker and their models stay in `stats-dashboard`.
- **No rename of the metric labels.** The analytics spec settled `Visitors (per day)` and `Clicks`; the
  mockup's "Unique Visitors" is a name this product cannot use, because a visitor is counted per day.
- No schema change, no migration, no new dependency, no change to the constructor or the block schema.

## Anti-goals

- **A delta with no baseline.** `previous = 0` prints no delta, ever — a rise from nothing has no rate.
- **Zeros where the numbers could not be fetched.** A failed overview renders the failed card, not a
  dashboard of zeros: "nothing happened" and "we could not ask" stay different facts.
- **A draft that looks published.** The row keeps a status tag; dropping it would hide the one state an owner
  must not confuse.
- **Cards that disagree with the rows.** Both come from one overview read, joined to the list by id, never
  from two reads of the same metric.

## Constraints

- i18n keys go into both `en-US.ts` and `ru-RU.ts`.
- This change touches no `@links/ui` source, so no library rebuild is needed before web sees it.
- Tests are vitest + `@vue/test-utils`; new model logic carries its own test, and markup carries `data-*`
  hooks a test reads instead of text where the text is a translation.
- Conventional commits; `pnpm verify` is the floor.

## Approaches considered

**A. Compose the page from `stats-dashboard` and the links store, joining rows locally. Chosen.**

**B. A separate `links-dashboard` widget set for this screen.** Rejected: the analytics spec's anti-goal
forbids a second source of truth for a metric, and a second set of cards would drift from the first.

**C. A visual restyle of the existing table, no numbers.** Rejected: the numbers are the mockup's point;
the result would be the screen it already is with rounder corners.

## Design

### Layout

```
Links  [icon]                     [ 30 days v ]
Manage your links and track their performance

[ Clicks ]  [ Visitors ]  [ CTR ]  [ Views ]        <- each: icon, label, big number,
                                                       delta, sparkline
+---------------------------------------------------------------+
| Your Links                                    [ + Create Link ] |
| Page            Link            Clicks Visitors Updated Actions |
| [M] My page     https://…/slug  (copy)  5,732  4,391  Nov 8  [ ] Edit … |
|     /slug  [PUBLISHED]                                          |
| ...                                                             |
| Show [10 v] per page                          [ < ] 1 2 [ > ]   |
+---------------------------------------------------------------+
```

### Where each thing comes from

| Shown                                 | Source                                                      | Change        |
| ------------------------------------- | ----------------------------------------------------------- | ------------- |
| Card totals, deltas, per-link metrics | `GET /analytics/overview` (`totals`, `previous`, `links[]`) | none          |
| Per-card sparkline                    | `overview.timeseries` + the chosen preset                   | derived       |
| Row status                            | `GET /links` (`LinkStatus`)                                 | none          |
| Row "Updated"                         | `LinkDto.updatedAt`                                         | **new field** |
| Row title, slug                       | `GET /links`                                                | none          |
| Public link and its copy button       | `public.baseUrl` + slug                                     | none          |

Two reads on mount — the overview for the numbers, the owner's list for the rows — joined by id. A page the
overview has no numbers for reads as zeros; a failed overview renders the failed card instead of the cards
and the table. Deleting a row refetches both, so the cards never describe a list the table no longer shows.

### Decisions taken with the owner

1. **Monogram instead of a thumbnail** — there is no preview image to show.
2. **`updatedAt` on the link DTO** — the entity already has it; only the DTO withheld it. No migration.
3. **Status stays**, as a small tag beside the slug, though the mockup dropped it.
4. **`Visitors (per day)` keeps its label**; the card order follows the mockup (clicks, visitors, CTR, views)
   and the range defaults to 30 days on this screen.

### i18n

New keys, both locales: the page heading and subtitle, the card title, the create action, the six column
heads, the copy action and its confirmation, and the footer's "show" / "per page" pair. The card labels stay
`stats.totals.*`, and a failed read stays `stats.failed`.

### Tests

- `LinkDto` carries `updatedAt` as an ISO string.
- `metricSpark` returns one number per day of every preset, zero-fills the quiet days, and derives CTR per
  day from that day's clicks and views (a day with no views is 0, not `NaN`).
- `linksRows` joins metrics by id in the links list's order, and a page with no metrics reads as zeros.
- The metric cards draw a sparkline only when a series is given, and keep their deltas as they are.
- The links card pages the rows, refetches on delete, and shows the empty state when there are no pages.
- The page renders the header, the four cards and one row per page; a failed overview shows the failed card
  and no rows.

## What is left to the builder

- The exact spacing of the card and the row, the monogram's size, the sparkline's stroke weight.
- Which icons the card and the header use, and the primary button's variant.
- The date format of the "Updated" cell (`dateStyle: "medium"`, in the reader's locale).
