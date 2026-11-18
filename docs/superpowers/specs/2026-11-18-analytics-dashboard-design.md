# Analytics dashboards: one widget set, dense cards, deltas and a live feed

## Why

The analytics screens work but read like a report: a few flat cards, a bar chart of one metric, two
tables. The owner's question is "is this page worth keeping, and what should I change?" — and the
current screen makes them assemble the answer from raw numbers. A denser dashboard, with the same
numbers looked at against the previous period and with the shapes drawn, answers it at a glance.

The mockup that started this describes the **home overview** (all pages) in the app's dark theme. The
per-page screen shows a different set of breakdowns and needs the same language, not the same layout.

**Top Referrers is not cut.** The card shows every ranked source, as the table does today; "Top" is a
label, not a cap. The card is as tall as its rows, and that is revisited only if a page's source list
actually grows a scroll.

## Goals

1. Metric cards carry an icon, a big number, and a delta against the previous period of the same
   length.
2. The chart draws one of three metrics — visits, visitors, clicks — chosen by a toggle, as an area
   chart rather than bars.
3. The source breakdown renders as ranked share bars ("Top Referrers"), keeping the source/medium
   semantics the collector already derives.
4. The overview's page list becomes "Links Performance": monogram, title and slug, clicks, visitors,
   CTR, and a per-day sparkline, each row a link to that page's screen.
5. The overview gains "Recent Activity": the latest view and click events across the owner's pages,
   each named by page and source.
6. Both screens render correctly in light and dark, from semantic tokens only.

## Non-goals

- **No locations, no geo, no country.** Confirmed out for now. The collector stores neither IP nor
  user-agent, and the visitor hash is daily and salted; a country would need an IP read at ingest, which
  is a privacy-model change, not a feature.
- No third-party collector, no script tag.
- No collection change beyond what the new reads need: the entities, the beacons and the rate limits
  stay as they are.
- No real-time refresh, no export, no alerts, no funnels.
- No new breakdown of device, browser or anything else derived from the user-agent.
- No change to the block schema, the page theme or the constructor.

## Anti-goals

Things that would make this worse than the report it replaces:

- **Deltas that lie.** A delta is only printed when both bounds of the window are known, and the
  previous window is the same length, immediately before it, fully bounded. A comparison against a
  partial period, or against "all time", is worse than no delta.
- **A sparkline that shapes a trend from sparse days.** The series carries only the days that had rows;
  the client fills the range's empty days before drawing, exactly as the main chart does.
- **A number the owner cannot explain.** "Visitors" stays a sum of daily distinct visitors — the label
  says so — and CTR stays clicks ÷ views. Nothing is called "unique over the period" when it is not.
- **A second source of truth.** Clicks are counted in `block_events` only; every new read aggregates
  those same rows. No counter column, no rollup table.
- **A dark-only dashboard.** Every surface uses the semantic tokens the kit already flips under
  `:root[data-theme="dark"]`; nothing hard-codes a colour that only reads on one theme.

## Constraints

- Reads stay ownership-scoped: the overview over `linksService.list(user)`, a page over
  `linksService.getOwned(user, id)`, before any aggregate runs. The new activity read takes the same
  page list, never a client-supplied set of ids.
- `Visitors (per day)` is the label, in both locales: the daily salt rotates, so a range's visitor count
  is the sum of its days' distinct visitors, not distinct people over the range.
- The backend tests compile through SWC, so type-only imports stay `import type`.
- `apps/web` consumes `@links/ui` and `@links/blocks` from `dist/`; a widget change needs no library
  rebuild, but a `@links/ui` token change does.
- Docs and commits: this document describes the target; behaviour changes ship with their doc updates.

## Approaches considered

**A. Redesign the existing widgets in place, shared by both screens.** Rework `stats-dashboard`
(`TotalsCards`, `VisitsChart`, `SourcesTable`, plus a new links-performance and activity card) and both
pages. One component set, one API layer, one place to fix a metric. **Chosen.**

**B. A separate `analytics-dashboard` widget set for the mockup, the old one left for the per-page
screen.** Visually cleaner at the start, but two near-identical component sets and two places where the
same metric is computed — the drift this repo's analytics design already warned against.

**C. Visual layer only, no new data.** Restack what exists: cards, the visits-only chart, the source
table, the page list without sparkline. Fast, but the deltas, the sparklines and the activity feed are
the parts of the mockup that carry the value; the result would look approximate and answer no new
question.

Chosen: **A**, because the mockup is the same dashboard with the same data, tightened and drawn.

## Design

### Data the screens need, and where it comes from

| Shown                                | Source today                                         | Change                                            |
| ------------------------------------ | ---------------------------------------------------- | ------------------------------------------------- |
| Cards: visits, visitors, clicks, CTR | `totals`                                             | none; CTR is added to the overview cards too      |
| Card deltas                          | —                                                    | `previous: StatsTotals \| null` on both responses |
| Chart, three metrics                 | `timeseries` (already per-day views/visitors/clicks) | none; the client picks the series                 |
| Top Referrers                        | `sources` (already merged, ranked, with share)       | none; rendered as bars                            |
| Links Performance totals + CTR       | `overview.links`                                     | none                                              |
| Links Performance sparkline          | —                                                    | `overview.links[].spark: SparkPoint[]`            |
| Recent Activity                      | —                                                    | new `GET /analytics/activity`                     |

**Previous period.** Both read endpoints gain `previous`, non-null only when the request carries both
`from` and `to`. It covers `[from − (to − from), from)` — the same length, immediately before the
window — and carries the same four totals the current window does: visits and clicks from the totals
scans, and visitors from the daily series over that range, because on the overview the card's
`visitors` is the merged series (a person who opened two pages is one visitor there, two in a per-page
scan). A previous window built from the per-page totals would compare the card against a different
metric — the drift this design's anti-goal forbids. The server derives the window from the query
bounds, so the definition lives in one place and the client sends nothing extra. The `all time` preset
sends no bounds and therefore gets no previous period and no delta.

**Delta semantics.** A count's delta is the relative change, `round((cur − prev) / prev × 100)`, with
an explicit sign. The CTR card's delta is in **percentage points**, `round(cur rate − prev rate × 100)`,
because a relative change of a ratio is not what an owner reads off a percentage. A delta is shown only
when the previous window has a baseline: `prev = 0` prints **no delta**, neither an arrow nor "new".
A rise from nothing has no rate, and a flat zero is not progress; a chip that says either would be the
lie the anti-goals rule out. This is the one decision here worth an owner's confirmation.

**Sparkline.** `OverviewLinkRow` gains `spark: SparkPoint[]`, where `SparkPoint = { date: string; views:
number }`, from one grouped scan by `(linkId, date)`, sparse like the main series. Every spark is filled
against one shared span — the requested range, or for `all time` the union of the rows' first and last
days — never each link's own span: two rows drawn on different spans look comparable and are not. The
spark is a **line**, not a filled area. A page with no rows draws a flat line at zero, not an absent
column, so the rows keep their rhythm. This is a second query per overview read; at this product's
volume it is cheap, and it is the honest cost of the sparkline.

**Activity.** A new read, scoped like the overview: the latest view and click rows across the owner's
pages, merged newest-first, cut to a limit, each labelled by the page it happened on and the source it
came from. It is a live feed, not a period view: it takes **no** `from`/`to`, so switching the range
picker never empties it, and the `all time` preset needs no special case.

```
ActivityItem = {
  id: string
  kind: "view" | "click"
  linkId: string
  slug: string
  title: string
  blockId: string | null   // a click names its block; a view has none
  source: string           // the classifySource label: direct, internal, a host, a utm source
  medium: string
  at: string               // ISO
}
```

`GET /analytics/activity?limit=` answers `{ items: ActivityItem[] }`. `limit` defaults to 10 and is
**clamped** to 50 (100 asks for 50, not a 400); a zero, negative or non-integer `limit` is a 400 from
the DTO. Ownership is `linksService.list(user)` first; a page id from the query is never trusted. Views
come from `page_views` only: `block_events.kind` admits `"view"` but nothing writes it, so a
`blockId` is always null on a view and always set on a click. `createdAt` is stored to the second, so
newest-first orders by `createdAt` then by `id`, or the order — and its test — is unstable. Source
labels come from the existing `classifySource`, so a rename of a host list relabels history here too.

### The API surface

`StatsTotals`, `StatsPoint`, `StatsSource`, `BlockClicks` are unchanged. Added: `previous` on
`LinkStats` and `OverviewStats`; `spark` on `OverviewLinkRow`; `SparkPoint`; `ActivityItem`;
`GET /analytics/activity`. The frontend mirrors these in `shared/api/backend/types.ts` and adds
`AnalyticsApi.getActivity`.

### The screens

Both screens keep their current shells and data flow; the widget set they compose changes.

**Home overview.** Header with the range picker; four metric cards (visits, visitors, clicks, CTR);
the area chart with the metric toggle; a two-column band with **Top Referrers** and **Recent
Activity**; then **Links Performance** full width.

**Per-page.** Header with the range picker, the page title and the "edit" / "open page" actions; the
same four metric cards; the area chart with the toggle; then Top Referrers and the existing per-block
clicks table. It has no Links Performance (a page is not a list of pages) and, on this pass, no
activity feed.

**Widgets.** `TotalsCards` grows a delta chip and an icon per card. `VisitsChart` becomes
`TrafficChart`: an area chart over the chosen metric, with a toggle in its header, still client-only
and still boxed by a fixed height on the server. `SourcesTable` becomes `ReferrersCard`: the same rows
as ranked bars with the share already computed, the medium shown beneath the source. New:
`LinksPerformance` (overview) and `RecentActivity` (overview). `RangePicker` stays the toggle group it
is — the mockup's dropdown is a restyle, not a behaviour worth new code.

### Theming

Nothing in the widgets names a literal colour. Surfaces stay `bg-gohan`, text `text-bulma` / `text-trunks`,
accents from the existing palette tokens (`piccolo` for the chart, per-card icon accents). Under
`:root[data-theme="dark"]` the kit already flips those tokens, so the mockup's dark look is the app in
its dark theme — no per-screen theme attribute, which the `:root`-scoped selectors would not honour
anyway. If the analytics screen is ever wanted dark _regardless_ of the app theme, that is a UI-kit
change (a scoped theme wrapper), deliberately not part of this.

### i18n

New keys in `en-US.ts` and `ru-RU.ts`: the chart's three metric names, the referrers card title, the
links-performance card title and its column heads, the activity card title, its empty state, and the
relative-time forms. The existing `stats.totals.*` labels are kept, `Visitors (per day)` included.

### Tests

- Backend: `previous` is present exactly when both bounds are given, and its visitors equal the prior
  range's daily-series sum (not its per-page total); a link with no prior rows gives `previous` with a
  zero, which the client renders as no delta; the activity read is ownership-scoped, ordered
  newest-first with the id tie-break, clamps `limit`, rejects a bad one, and leaves `blockId` null on a
  view; the spark series is per link and sparse.
- Web: a metric card prints a delta only with a baseline (`previous.views/clicks` non-zero) and uses
  percentage points for CTR; the chart switch changes the drawn series; the referrers bars use the same
  share as before; Links Performance shows CTR and draws a one-span sparkline for a sparse series; the
  activity feed renders items and its empty state.
- Bruno: `GET /analytics/activity` — owned, unauthenticated, a clamped `limit`, and a rejected one.
- Existing analytics tests stay green; labels they assert on are unchanged.

## What is left to the builder

- The chart component and its gradient (an area/line over unovis, in place of the stacked bars).
- Icons per card and their accent tokens.
- The relative-time formatting for the activity feed, and its dash-vs-dot styling.
- The sparkline's stroke width and the row layout that holds it.
