# Visitor analytics: own collection, read-time aggregation, two dashboards

## Why

A page built here has no way to tell its owner whether anybody opened it. There is a click counter in
the constructor's block panel, and nothing else: no page views, no visitors, no idea where a visitor
came from. An owner deciding what to keep on a page — which link is dead weight, which post to write
next, whether the link in a Telegram channel did anything — has nothing to decide with.

The owner is the customer. The dashboard is the feature: what a visitor did is only interesting as a
number the owner can read and act on.

External analytics (Umami, Yandex Metrica) is **out of scope**. It is a likely future per-page
setting, and the design keeps a seam for it, but nothing about it is built now.

## Goals

1. A page reports its own visits: how many times it was opened, by how many distinct visitors.
2. Block clicks keep working and gain the same source data, so "clicked 120 times, 88 people" is one
   query, not a join.
3. A visit says where the visitor came from: utm tags first, referring host second, `direct` when
   neither exists. A visitor walking from one of the owner's pages to another is counted as a visit and
   labelled `internal` — it happened, it just was not acquired.
4. The home screen is a dashboard over all of the owner's pages; each page has its own screen with a
   time series, sources and per-block clicks.
5. Nothing stored identifies a person, and analytics never costs a visitor their click.

## Non-goals

- No Umami, Yandex Metrica or any third-party collector, and no script tag for one.
- No cookies, no `localStorage`, no cross-day identity, no user-agent or IP storage.
- No bot or crawler filtering: a request that looks like a page load is counted.
- No device, browser, country or city breakdown — that needs a user-agent parser and geo data, and
  the IP that would feed the latter is not stored.
- No retention job or pruning. The tables grow; the documented limit is where it stops being fine.
- No real-time refresh, no export, no alerts, no funnels, no `utm_content`/`utm_term`.
- No sessions: no time on page, no scroll depth, no `visitId`. Adding one later is a migration, not a
  rewrite.
- No change to the block schema, the theme model, or the constructor's editing behaviour.

## Anti-goals

Things that would make this a failure even if every number renders:

- **Numbers the owner cannot explain.** Internal navigation reported as `direct` would inflate the one
  bucket every page has; visits lost to a rate limit would make a busy page look quiet.
- **Analytics that costs a visitor something.** A tracker that throws, blocks navigation, or delays
  the page. The existing beacon helper already never throws, and that property is preserved.
- **A collector aggressive enough to be a privacy problem.** Storing an IP, a user agent or a stable
  cross-day identifier would make the feature something the owner has to apologise for.
- **Two sources of truth for one number.** Clicks per block are counted in one table only; the
  constructor panel and the stats screen read the same rows.

## Current state

- `apps/backend/src/analytics/` — `block_events` (one row per event: `linkId`, `blockId`, `kind`
  (`click`|`view`), `createdAt`), a `SlidingWindow` rate limiter (60 events per block, 300 per page
  per minute), `AnalyticsService.record()` and `.blockStats()`, and a 404 when the page is not
  published.
- `apps/backend/src/public/public-events.controller.ts` — `POST /public/links/:slug/events`. The block
  id is validated against the page the server just loaded, never trusted from the body.
- `apps/backend/src/links/links.controller.ts` — `GET /links/:id/stats` returns
  `{ blocks: [{ blockId, clicks, views }] }`, ownership settled by `getOwned()` first.
- `apps/web/src/shared/blocks/analytics.ts` — `trackBlockEvent()`, a `sendBeacon` that never throws.
- `apps/web/src/features/links/ui/link-page-renderer/link-page-renderer.vue` — one delegated click
  listener for the whole page; reports nothing when `slug` is absent, which is how the owner's preview
  stays out of the numbers.
- `apps/web/src/widgets/multilinks-constructor/ui/block-stats/block-stats.vue` — reads
  `GET /links/:id/stats` once when the panel opens and shows clicks. Views are deliberately not shown:
  nothing reports an impression, because a beacon per block per visit would exhaust the per-block
  window and answer 429 to real clicks.
- `apps/web/app/pages/index/index.vue` — literally `To be implemented`.
- The backend runs Express behind nginx/traefik; `configureApp()` in
  `apps/backend/src/configure-app.ts` is shared with the test harness.

## Approaches considered

### Storage and aggregation

**A. Raw events, aggregate at read time.** One row per event, `GROUP BY` on the read path.

**B. Pre-aggregated daily counters.** `daily_stats(linkId, day, blockId, source)` with `views`,
`visitors`, `clicks`, updated by `INSERT … ON CONFLICT DO UPDATE` on every event.

**C. Read from an external service.** Rejected by the owner before evaluation: no third-party
collector for now.

B's table stays small at any volume, but it buys a scale this product does not have (thousands of
events a month) by giving up what it will certainly want: every new breakdown — campaign, page, device
— needs a new migration and starts counting from zero, and history can never be recomputed. A's cost
is a table that grows and read queries that will eventually need indexes and pruning; both are known
and both are cheap to add later, while B's cost is permanent.

**Chosen: A. Raw events, aggregate at read.** Revisit only when a dashboard request actually becomes
slow — at which point the fix is an index or a rollup materialised _from_ the raw rows, which A keeps
possible and B does not.

### Where a click's source comes from

**A1. Every event carries its own source.** The page view and the click both report the utm tags,
referring host and visitor hash. Clicks by source is a plain `GROUP BY` on the clicks table.

**A2. A visit id.** The page generates an id on load, sends it with the view and with every click;
sources live on the view row and clicks join to it.

A2 only pays off when the source can change inside one visit. Here a page is one server-rendered
document: the visitor lands, the page loads, the source is fixed until the next navigation. A2 would
add a mandatory identifier to every beacon and a join to every read to model something that does not
happen.

**Chosen: A1.** Consequence: `block_events` gains the same source columns as `page_views`, and both
endpoints share one source DTO, one normaliser and one set of tests. If sessions arrive later, a
`visitId` column is one migration and A1's data is still correct.

## Design

### Data

Two migrations, both hand-written from generated ones in the style of `AddBlockEvents`.

**`page_views`** — one row per page load.

| column             | type                  | notes                                                      |
| ------------------ | --------------------- | ---------------------------------------------------------- |
| `id`               | varchar PK (uuid)     |                                                            |
| `linkId`           | varchar, FK → `links` | `ON DELETE CASCADE`; a deleted page takes its rows with it |
| `utmSource`        | varchar null          | lowercased, capped                                         |
| `utmMedium`        | varchar null          | lowercased, capped                                         |
| `utmCampaign`      | varchar null          | lowercased, capped                                         |
| `referrerHost`     | varchar null          | external referring host, lowercased, `www.` stripped       |
| `referrerInternal` | boolean, default 0    | the referrer was our own site                              |
| `visitorHash`      | varchar not null      | see below                                                  |
| `createdAt`        | datetime, default now |                                                            |

Indexes: `(linkId, createdAt)` for range reads, `(linkId, visitorHash)` for distinct counts.

**`block_events`** — the same six source columns appended, plus the same two indexes. `kind` stays as it
is; only `click` is ever written, and `view` becomes a value nothing produces. It stays because
dropping a column from a table with history is churn for no gain, and because a future non-click block
event has an obvious home.

`block_events.visitorHash` is **nullable**, because that table has history. A row written before this
change has no hash, so it counts as a click but as zero distinct clickers; the constructor panel, whose
only number is the click count, reads exactly what it read before. No hash is invented for those rows:
a sentinel would make every legacy block report one visitor, and deleting the rows would silently erase
clicks the owner has already seen. The same rows also have no source columns, so they resolve to
`direct`.

### The visitor hash

```
visitorHash = sha256(ip | userAgent | dailySalt).slice(0, 16)
dailySalt   = sha256((ANALYTICS_SALT ?? JWT_SECRET ?? "links-dev") + "|" + YYYY-MM-DD)
```

- Never stored or logged anywhere else: it exists as a hex string on an event row and as an in-memory
  rate-limit key.
- The day is UTC, and rotates the salt, so yesterday's hashes cannot be matched against today's. This
  is why "unique visitors over 30 days" is the **sum of daily uniques**, and the dashboard says so by
  labelling the metric per the range it covers.
- The hash deliberately does **not** include `linkId`: the same person on two of the owner's pages in
  one day is one visitor on the home dashboard, and one visitor on each page's own screen. It still
  cannot be matched across days, and it is only ever read within a range of rows already filtered by
  ownership.
- The UTC day is the day end to end — the salt's, the `date(createdAt)` the queries group by, and the
  axis label. A local-day bucket would split one hash across two bars and break `range visitors =
  Σ daily visitors`. The consequence is stated in the docs and in the UI label, not hidden: a Moscow
  owner's evening visits land on tomorrow's bar.
- `ip` comes from `req.ip`, which needs one trusted proxy hop:
  `app.set("trust proxy", 1)` inside `configureApp()`, so tests see the same behaviour. Without it
  every visitor behind the proxy collapses into one unique — the reason this is written down here.
- `userAgent` is truncated to 256 characters before hashing.
- The IP and user agent reach the hash through the controller, which extracts them from the request;
  `AnalyticsService` takes plain `{ ip, userAgent }` and knows nothing about Express.

### Reporting

**`POST /public/links/:slug/views`** (new, unauthenticated) — body is the source DTO only. Resolves the
published page exactly as `POST /public/links/:slug/events` does, records, answers `{ ok: true }`.

**`POST /public/links/:slug/events`** (existing) — `{ blockId, kind }` plus the same source fields.

Shared DTO `EventSourceDto`: `utmSource`, `utmMedium`, `utmCampaign`, `referrerHost` — optional
strings, lowercased and capped (100 characters for utm, 253 for a host, which is what a hostname may
be), `referrerInternal` — optional boolean. Naming every field is what makes the global
`forbidNonWhitelisted` pipe reject an IP or a user agent smuggled into the body.

Rate limits. Views get their own `SlidingWindow`, separate from clicks so neither can spend the
other's budget:

- views: key `visitorHash`, 10 per minute; scope `linkId`, 300 per minute. A page load is one event,
  so the key limit is the reload guard, not a traffic ceiling.
- clicks: unchanged — key `linkId:blockId`, 60 per minute; scope `linkId`, 300 per minute.

This is the one place where a window key stops being content: `sliding-window.ts`'s comment ("the keys
are content, never a caller") must be updated to say that a view's key is a rotating one-way hash,
never an identity. The property the comment protects — no per-visitor budget that can be spent down,
no visitor anything stored — still holds.

It also stops being bounded by content, which the class never had to survive: `admit()` only ever adds
keys and `recent()` never removes one, so a key per visitor per day grows the map for the life of the
process. `SlidingWindow` therefore gains eviction — on each admit, keys and scopes whose timestamps
have all aged out are dropped. Lazy eviction on the paths that run anyway, not a timer: the map is only
read inside `admit()`, so that is the only place it has to be small. The click window shares the class
and its tests, and both get cheaper from it.

### Reading

Reads live in a new `AnalyticsController` in the analytics module, guarded by `AuthGuard`, with
ownership resolved before any query runs. Moving them off `LinksController` avoids a `GET /links/stats`
route declared before or after `GET /links/:id`, which is a trap that only shows up in production.

**`GET /analytics/links/:id?from&to`** (replaces `GET /links/:id/stats`, whose only caller is the
constructor panel):

```json
{
  "totals": { "views": 1284, "visitors": 913, "clicks": 247 },
  "timeseries": [{ "date": "2026-11-17", "views": 42, "visitors": 31, "clicks": 9 }],
  "sources": [{ "source": "t.me", "medium": "social", "views": 305, "visitors": 244, "clicks": 70 }],
  "blocks": [{ "blockId": "b1", "clicks": 120, "visitors": 88 }]
}
```

**`GET /analytics/overview?from&to`** (new):

```json
{
  "totals": { "views": 1284, "visitors": 913, "clicks": 247 },
  "timeseries": [{ "date": "2026-11-17", "views": 42, "visitors": 31, "clicks": 9 }],
  "sources": [{ "source": "t.me", "medium": "social", "views": 305, "visitors": 244, "clicks": 70 }],
  "links": [{ "id": "…", "slug": "my-page", "title": "My page", "views": 913, "visitors": 620, "clicks": 187 }]
}
```

Both accept the existing `from`/`to` ISO-8601 pair; absent means unbounded on that side. Both aggregate
two tables and merge them by date and by source label; totals come from the same two scans.

`overview` starts from the owner's **links**, not from the events: a page nobody opened is a row of
zeros, because "this page got nothing" is the thing the owner needs to see. `links/:id` reads one page
and has no such list.

Rules that keep the numbers explainable:

- **Source label, resolved at read time**: `utmSource` if present, else `referrerHost` if present, else
  `internal` when `referrerInternal`, else `direct`. `utmMedium`, when present, is the medium;
  otherwise a small static map classifies a host as `search` (google, bing, duckduckgo, yandex, …),
  `social` (t.me, telegram, x.com, vk, …) or `referral`. Unlisted hosts are `referral`. The map lives in
  one module and is applied on read, so the list can grow and history re-classifies itself.
- **Timeseries is sparse**: a day with no events has no row. The client knows the range it asked for
  and draws the missing days as zeros. Only `all time` derives its range from the first and last rows.
- **No derived numbers cross the wire.** CTR is `clicks / views`, computed where it is displayed.
- **`sources[].visitors` is per source** and its sum can exceed `totals.visitors`: a person who clicked
  a Telegram link and later a Google result is one visitor and two sources. The source table's share is
  therefore computed from views, never from visitors.
- **`visitors` is `COUNT(DISTINCT visitorHash)`** over the same filtered rows — the per-day figure, per
  the hash section above. On a multi-day range it is the sum of daily uniques, and the UI labels the
  card with the range it covers.
- **`blocks` only carries clicks**, plus `visitors` for distinct clickers per block. The dead `views`
  field goes, and so does the comment in `block-stats.vue` that explains why it was always zero.

### Client collection

`apps/web/src/shared/blocks/analytics.ts` grows a sibling of `trackBlockEvent`:

```ts
export function trackPageView(input: { slug: string; origin: string }): void;
```

Both functions build the same source payload and both go through `sendBeacon` and never throw. Source
capture is one module-level function `readSource()`:

- utm from `location.search` — `utm_source`, `utm_medium`, `utm_campaign`, lowercased, capped.
- `document.referrer` parsed as a URL; unparseable counts as absent. Same host as `location.host` →
  `referrerInternal: true` and no host. Otherwise the host, lowercased, `www.` stripped.
- Captured once per page load and reused by every click on that page: a navigation replaces the
  document, so the value can never go stale within a page.

The page view fires from `link-page-renderer.vue`'s click listener's sibling: a `reportView()` on mount,
guarded by the same `props.slug` check, so the owner's preview and the constructor's workspace report
nothing. `onMounted` is client-only, so SSR never counts a request the visitor's browser has not run.

### Screens

**Home — `/`.** `apps/web/app/pages/index/index.vue` stops being a placeholder and renders
`src/pages/index/ui/index-page.vue` (plus `src/pages/index/index.ts`), with
`definePageMeta({ title: "pages.index.title", middleware: "auth" })`.

**Per page — `/links/[id]/stats`.** New pair `apps/web/app/pages/links/[id]/stats.vue` →
`src/pages/links-stats/ui/link-stats-page.vue` (`src/pages/links-stats/index.ts`),
`definePageMeta({ title: "pages.links.stats.title", middleware: "auth" })`.

Both screens are assembled from one widget, `src/widgets/stats-dashboard/`, so the two differ only in
what replaces the last table:

```
Главная (сводка)                    /links/[id]/stats
┌──────────────────────────────┐    ┌──────────────────────────────┐
│ [7 дней][30 дней][всё время] │    │ [7 дней][30 дней][всё время] │
│ Визиты    Уники    Клики     │    │ Визиты    Уники    Клики  CTR│
│  1 284     913      247      │    │  913      620      187    20%│
│                              │    │                              │
│ ▁▂▅█▆▃▂  визиты по дням      │    │ ▁▂▅█▆▃▂  визиты по дням      │
│                              │    │                              │
│ Источники                    │    │ Источники                    │
│  direct        612   48%     │    │  direct        412   45%     │
│  t.me  соцсеть 305   24%     │    │  t.me  соцсеть 305   33%     │
│  google поиск  214   17%     │    │  google поиск  114   12%     │
│                              │    │                              │
│ Страницы                     │    │ Блоки                        │
│  my-page 913 620 187         │    │  ссылка A  120 кликов  88 ч. │
│  blog     371 240  60        │    │  ссылка B   88 кликов  61 ч. │
└──────────────────────────────┘    └──────────────────────────────┘
```

- The range picker sets `from`/`to` from the client clock; `all time` sends neither.
- The chart is inline SVG bars, hand-rolled. No chart dependency: one series, one axis, ~40 lines of
  template. A library would be a dependency and a bundle for something the UI kit has no vocabulary
  for.
- Empty, loading and failed states are per screen and must be distinguishable: "no visits yet" is not
  "we could not ask", and the submissions list already establishes that distinction
  (`failed: true` rather than an empty array).
- Entry points: `link-actions.vue` gets a `Статистика` action (desktop button and mobile menu item),
  and the constructor toolbar gets an icon button next to save/back pointing at `/links/{id}/stats`.
- New i18n keys in `src/shared/locales/{en-US,ru-RU}.ts`: `pages.index.*`, `pages.links.stats.title`,
  `stats.*`. Existing hardcoded English inside the constructor (block panel labels) stays as it is
  except for the strings this change touches.

### Client API

`src/shared/api/backend/analytics/` with `get-overview.ts` and `get-link-stats.ts`, exported from
`~shared/api`, types (`StatsTotals`, `StatsPoint`, `StatsSource`, `LinkStats`, `LinkStatsRow`,
`OverviewStats`) in `src/shared/api/backend/types.ts`. `getLinkStats` keeps its current contract — the
constructor panel still receives an array of block counters — and reads `blocks` out of the richer
response.

### Tests and checks

- `apps/backend/test/analytics.spec.ts` extends to: a view is stored and counted; a view for a draft or
  unknown page is 404; unknown body fields still 400 (`ip`, `userAgent`); utm wins over the referrer;
  internal referrer is not `direct`; two requests from the same ip+ua in one day are one visitor and
  two views; a different linkId is a different visitor; the view window refuses the 11th reload; the
  overview only sees the caller's pages and 401s without a session; the timeseries respects `from`/`to`;
  deleting a link deletes its views.
- The visitor hash is unit-tested directly: same inputs → same hash, different day → different hash,
  no plaintext ip in the output, two links in one day → one hash.
- `SlidingWindow` gains eviction tests: a key whose window has emptied leaves no entry, and the click
  window's existing behaviour is unchanged.
- A `block_events` row written before the migration reads as one click and no distinct clicker, and as
  `direct` in the sources breakdown.
- `apps/web` tests: `readSource()` — utm precedence, internal referrer, garbage referrer, absent
  referrer; `trackPageView` uses `sendBeacon` and swallows a throwing transport; the dashboard renders
  zeros for a sparse timeseries and shows the failed state instead of zeros when the API fails.
- Bruno (`apps/backend/.bruno`): `POST /public/links/:slug/views` and `GET /analytics/overview`,
  including the 401/404 paths.
- `pnpm verify` is the floor. Browser check on the constructor's click panel and one public page with a
  `?utm_source=` query, reading the DOM back rather than a screenshot.

### Docs

- `docs/conventions.md`: add `ANALYTICS_SALT` to the env table, and a line under the backend section
  about `trust proxy` and the two event tables growing until a retention decision is made.
- No change to `AGENTS.md`, no version numbers anywhere.

## What is left to the builder

- Column lengths, index and constraint names, migration class names and timestamps — follow
  `AddBlockEvents`.
- The static host→medium map's initial contents; start with the obvious search engines and social
  networks, everything else is `referral`.
- Chart geometry, card composition, spacing and the empty/loading/error visuals within `@links/ui`
  primitives and the UnoCSS preset.
- The per-screen fetch lifecycle (fetch on mount vs. on range change) and whether a range change
  refetches or filters client-side. Refetch: the API aggregates.
- Whether the constructor's block panel keeps its own fetch or shares the stats screen's data — it reads
  once on open today, and that stays acceptable.

## Decisions the owner should confirm while reading

1. **Home requires a session.** `/` becomes the dashboard behind `middleware: "auth"`; a signed-out
   visitor is redirected to sign-in. `no auth on home` would need a marketing shell that does not
   exist yet.
2. **`GET /links/:id/stats` moves to `GET /analytics/links/:id`.** Breaking change, one caller in this
   repo, no published API contract.
3. **Unique visitors are per day.** A 30-day "visitors" number is a sum of daily uniques, not distinct
   people over the month — a direct consequence of the salt rotation that keeps the hash honest.
4. **Days are UTC**, including on the chart. Local days would be friendlier to look at and would break
   the arithmetic above.
5. **`internal` visits are counted, only not credited to an acquisition source.** Excluding them would
   mean a filter on every query and a source bucket that can never hold a row.
6. **Legacy clicks keep their counts and lose their clickers.** `block_events.visitorHash` is nullable;
   rows from before this change count as clicks with no distinct visitors, and as `direct`.

## Addendum: presentation

The first pass rendered the two screens as bare tables and a bare chart — correct numbers, no page
container, no heading, no states. The screens were rebuilt on the app's own vocabulary:

- The container every other screen uses (`p-4 sm:p-10`, an inner `mx-auto max-w-6xl w-full`), a
  `text-moon-24 font-semibold` heading, and `UIToggleGroup` for the range — not three free-floating
  buttons.
- Totals are `UICard`s: one number per card, `text-moon-24` over a `text-moon-12 text-trunks` label. CTR
  appears only on the per-page screen, where it means one page's rate rather than an average of rates.
- The chart lives in a card with a title and the `Days are UTC` subtitle. It stays hand-rolled bars: one
  series, honest zeros, no dependency.
- Sources, pages and blocks are `UITable`s inside cards, two columns on a wide screen and stacked on a
  phone.
- Every screen has its three states: `UISkeleton` while loading, a card with the failure message when the
  request failed, and a line of text when there is nothing to show — never an empty table.
- The per-page screen gained a header with the page's title, its slug, and the two moves an owner wants
  from there: edit it, or open it. Without it the screen did not say which page you were reading.
