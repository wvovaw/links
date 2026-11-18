# Analytics Dashboards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the two analytics screens into one dense widget set — cards with period-over-period deltas, an area chart with a metric toggle, ranked referrer bars, a per-page performance list with sparklines, and a live activity feed — all on the app's existing light/dark tokens.

**Architecture:** Backend reads stay in `AnalyticsService` over the two raw tables, aggregated at read time; the two existing endpoints gain a `previous` totals block and a per-link `spark` series, and one new ownership-scoped endpoint serves the activity feed. Web reworks the `stats-dashboard` widgets in place and both pages compose them. No schema change, no new dependency, no collection change.

**Tech Stack:** NestJS + TypeORM + better-sqlite3 (backend); Nuxt + Vue 3 + UnoCSS `@links/ui` + `@unovis/vue` (web); vitest + supertest + `@vue/test-utils` (tests).

**Spec:** `docs/superpowers/specs/2026-11-18-analytics-dashboard-design.md`

## Global Constraints

- Reads stay ownership-scoped before any aggregate: `linksService.list(user)` for a portfolio read, `linksService.getOwned(user, id)` for one page. A page id from a query is never trusted.
- No schema change: no migration, no new column, no new table. Clicks are counted in `block_events` only.
- No IP, no user-agent, no cookie, no geo. The only visitor artefact stays the daily hash.
- `Visitors (per day)` is the label, in both locales: a range's visitor count is the sum of its days' distinct visitors.
- Every type-only import is `import type` — SWC does not emit type info and a plain import of a type breaks the backend runtime graph.
- i18n keys go into **both** `apps/web/src/shared/locales/en-US.ts` and `ru-RU.ts`.
- No new dependency for charts, dates or relative time.
- Widgets name no literal colour: surfaces use the semantic tokens (`bg-gohan`, `text-bulma`, `text-trunks`, palette accents), which the kit already flips under `:root[data-theme="dark"]`. No per-screen theme attribute.
- Behaviour change and its doc change ship together; this plan's only doc is the spec, already committed.
- Conventional commits, one per task, at the end of the task.
- Verification floor: `pnpm --filter @links/backend test`, `pnpm --filter @links/web test` (runs `vue-tsc` first), and `pnpm verify` once at the end.

## Review Focus

1. **A metric card on a window whose previous period has no rows** — no delta is printed, never `NaN`/`Infinity`/`+100%`. Test: Task 5.
2. **`previous.visitors` on the overview** — it must equal the previous _range's daily-series sum_, not the per-page total, so the delta compares like with like. Test: Task 1.
3. **The activity feed under the `all time` preset, which sends no bounds** — the feed still returns the newest items and a range change never empties it. Test: Task 3 and Task 9.
4. **A Links Performance sparkline for a page with no rows** — a flat zero line on the _shared_ span, never a collapsed or absent column that misreads as a trend. Test: Task 8.
5. **`limit` on the activity endpoint** — `limit=100` returns at most 50, `limit=0`/`1.5`/`abc` answer 400, and no `limit` returns 10. Test: Task 3.

---

### Task 1: `previous` totals on both read endpoints

**Files:**

- Create: `apps/backend/src/analytics/range.ts`
- Modify: `apps/backend/src/analytics/stats.ts`
- Modify: `apps/backend/src/analytics/analytics.service.ts`
- Test: `apps/backend/test/previous-range.spec.ts` (create)
- Test: `apps/backend/test/analytics.spec.ts` (add cases)

**Interfaces:**

- Consumes: `StatsQueryDto` (`{ from?: string; to?: string }`), the service's own `viewTotals`, `clickTotals`, `viewDays`, `totalOf`, `scoped`, `inRange`.
- Produces:
  - `previousRange(range: { from?: string; to?: string }): { from: string; to: string } | null` from `range.ts` — `null` unless both bounds are present; otherwise `[from − (to − from), from)` as ISO strings.
  - `LinkStats.previous: StatsTotals | null` and `OverviewStats.previous: StatsTotals | null` in `stats.ts`.
  - `AnalyticsService.linkStats(...)` and `.overview(...)` now fill `previous`.

- [ ] **Step 1: Write the failing test for `previousRange`**

```ts
// apps/backend/test/previous-range.spec.ts
import { describe, expect, it } from "vitest";

import { previousRange } from "../src/analytics/range";

describe("previousRange", () => {
  it("returns the same-length window immediately before the range", () => {
    expect(previousRange({ from: "2026-11-10T00:00:00.000Z", to: "2026-11-17T00:00:00.000Z" })).toEqual({
      from: "2026-11-03T00:00:00.000Z",
      to: "2026-11-10T00:00:00.000Z",
    });
  });

  /* No bounds means "all time": there is no window to compare against, and a made-up one would lie. */
  it("has no previous window when a bound is missing", () => {
    expect(previousRange({})).toBeNull();
    expect(previousRange({ from: "2026-11-10T00:00:00.000Z" })).toBeNull();
    expect(previousRange({ to: "2026-11-17T00:00:00.000Z" })).toBeNull();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/backend exec vitest run test/previous-range.spec.ts`
Expected: FAIL — `Cannot find module '../src/analytics/range'`.

- [ ] **Step 3: Implement `previousRange` in `apps/backend/src/analytics/range.ts`**

`to − from` in milliseconds, subtracted from `from`: both bounds are the same length apart as the current window, and the previous window ends exactly where the current one starts. Return ISO strings.

- [ ] **Step 4: Extend `stats.ts`**

Add `previous: StatsTotals | null;` to both `LinkStats` and `OverviewStats`.

- [ ] **Step 5: Fill `previous` in `analytics.service.ts`**

Add a private `previousOf(scope: Scope, range: StatsQueryDto): Promise<StatsTotals | null>`: return `null` when `previousRange(range)` is `null`; otherwise run `viewTotals`, `clickTotals` and `viewDays` over that window in parallel and return `{ views, visitors, clicks }` where `views` and `clicks` are the row sums and **`visitors` is the sum of the days' `visitors`** — the merged-series count, matching the card it is compared against (the per-page totals scan counts a person once per page, the series once per day; on the overview only the series matches the card).

Call it from `linkStats` and `overview` alongside the existing reads, and put the result in the returned object. Leave the existing `totals` untouched.

- [ ] **Step 6: Add the e2e cases to `apps/backend/test/analytics.spec.ts`**

Seed the previous window with a repository write, because a beacon only writes "now". Add a helper:

```ts
async function seedPreviousView(app: INestApplication, id: string, at: Date) {
  const views = app.get(DataSource).getRepository(PageView);

  await views.save(views.create({ linkId: id, visitorHash: "seed-visitor", createdAt: at }));
}
```

Cases: with both bounds given, `previous.views`/`previous.clicks` equal the seeded prior rows and `previous.visitors` equals the prior window's daily-series sum (one page, so one distinct visitor); with no bounds, `previous` is `null`. Seed a view ~10 days in the past and ask for a 7-day window that starts after it.

- [ ] **Step 7: Run the backend tests and make sure they pass**

Run: `pnpm --filter @links/backend test`
Expected: PASS, including the existing analytics suite.

- [ ] **Step 8: Commit**

```bash
git add apps/backend/src/analytics/range.ts apps/backend/src/analytics/stats.ts apps/backend/src/analytics/analytics.service.ts apps/backend/test/previous-range.spec.ts apps/backend/test/analytics.spec.ts
git commit -m "feat(backend): add previous-period totals to analytics reads"
```

---

### Task 2: Per-link spark series on the overview

**Files:**

- Modify: `apps/backend/src/analytics/stats.ts`
- Modify: `apps/backend/src/analytics/analytics.service.ts`
- Test: `apps/backend/test/analytics.spec.ts`

**Interfaces:**

- Consumes: the service's `scoped` / `inRange`, and `Scope`.
- Produces:
  - `SparkPoint { date: string; views: number }` in `stats.ts`.
  - `OverviewLinkRow.spark: SparkPoint[]`.
  - a private `sparkByLink(scope, range): Promise<{ linkId: string; date: string; views: number }[]>` grouped by `(linkId, date)`; `overview()` folds it into a `Map<string, SparkPoint[]>` and each `links[]` row carries its own (sparse, possibly empty).

- [ ] **Step 1: Write the failing test**

In `apps/backend/test/analytics.spec.ts`, add a case: publish a page; seed page views for it on two distinct UTC days; call `GET /analytics/overview` with a range covering both days; assert the row with that `id` has a `spark` array containing both days' `views`, and another page with no views has `spark: []`. Rows for the same day must not be duplicated.

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/backend exec vitest run test/analytics.spec.ts`
Expected: FAIL — `spark` is `undefined`.

- [ ] **Step 3: Implement**

Add `SparkPoint` and `OverviewLinkRow.spark` in `stats.ts`. Add `sparkByLink` in `analytics.service.ts` (mirror `viewDays`, adding `groupBy("v.linkId")` and `addSelect("v.linkId", "linkId")`), run it in `overview`'s `Promise.all`, and attach each link's points. A link with no rows gets `[]`.

- [ ] **Step 4: Run the tests and make sure they pass**

Run: `pnpm --filter @links/backend test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/backend/src/analytics/stats.ts apps/backend/src/analytics/analytics.service.ts apps/backend/test/analytics.spec.ts
git commit -m "feat(backend): add per-link spark series to the overview"
```

---

### Task 3: Activity feed endpoint

**Files:**

- Create: `apps/backend/src/analytics/dto/activity-query.dto.ts`
- Modify: `apps/backend/src/analytics/stats.ts`
- Modify: `apps/backend/src/analytics/analytics.service.ts`
- Modify: `apps/backend/src/analytics/analytics.controller.ts`
- Create: `apps/backend/.bruno/analytics/activity.bru`
- Test: `apps/backend/test/analytics.spec.ts`

**Interfaces:**

- Consumes: `classifySource`, `BlockEvent`, `PageView`, `Scope`, `scoped`.
- Produces:
  - `ActivityItem` in `stats.ts` — the exact shape from the spec (`id`, `kind`, `linkId`, `slug`, `title`, `blockId`, `source`, `medium`, `at`).
  - `ActivityQueryDto { limit?: number }` — `@IsOptional() @Type(() => Number) @IsInt() @Min(1)`. **No `@Max`**; the cap is a clamp, not a rejection.
  - `AnalyticsService.activity(links: { id: string; slug: string; title: string }[], limit = 10): Promise<ActivityItem[]>`.
  - `GET /analytics/activity` on `AnalyticsController`, guarded, answering `{ items: ActivityItem[] }`.

- [ ] **Step 1: Write the failing tests**

Add to `apps/backend/test/analytics.spec.ts`: publish a page; seed one `PageView` at `T0` and one click `BlockEvent` at `T0 + 1s` through the repositories (a beacon only writes "now"); then

- `GET /analytics/activity` → 200, `items[0].kind === "click"` with `blockId === "b1"`, `items[1].kind === "view"` with `blockId === null`, both carrying the page's `slug`/`title` and a `source`/`medium` (`direct` when nothing else is set);
- the feed takes no range: `?limit=1` returns exactly one item, and `?from=2026-01-01T00:00:00.000Z` is a **400** — `from`/`to` are not in the DTO, and the pipe forbids unknown fields;
- `?limit=100` → 200 and `items.length <= 50` (clamp, not 400);
- `?limit=0` and `?limit=1.5` → 400;
- an unauthenticated request → 401.

- [ ] **Step 2: Run them to verify they fail**

Run: `pnpm --filter @links/backend exec vitest run test/analytics.spec.ts`
Expected: FAIL — `/analytics/activity` answers 404.

- [ ] **Step 3: Implement `ActivityQueryDto`**

`apps/backend/src/analytics/dto/activity-query.dto.ts`, mirroring `StatsQueryDto`'s style and doc comment. Import `Type` from `class-transformer`, `IsInt`/`IsOptional`/`Min` from `class-validator`.

- [ ] **Step 4: Implement `activity`**

`const cap = Math.min(limit, 50);` Then fetch the latest `cap` view rows and the latest `cap` click rows, each scoped to `links.map(l => l.id)` and ordered `createdAt DESC, id DESC` (the id tie-break matters: SQLite stores seconds). Map a view row to `{ kind: "view", blockId: null, ...classifySource(row), at }` and a click row to `{ kind: "click", blockId: row.blockId, ... }`. Merge, sort by `at DESC` then `id DESC`, slice to `cap`. Look up `slug`/`title` from a `Map` built from `links`; append `id` from the row id.

`block_events.kind = "view"` is never written — read views from `page_views` only, clicks from `block_events`.

- [ ] **Step 5: Add the controller route**

In `apps/backend/src/analytics/analytics.controller.ts`, add (before `links/:id` is irrelevant — `activity` does not collide, but keep the `overview` first, `activity`, then `links/:id`):

```ts
@Get("activity")
async activity(@CurrentUser() user: User, @Query() query: ActivityQueryDto) {
  return { items: await this.analytics.activity(await this.linksService.list(user), query.limit) };
}
```

`ActivityQueryDto` and `User` are value imports, as the file's comment already explains.

- [ ] **Step 6: Run the tests and make sure they pass**

Run: `pnpm --filter @links/backend test`
Expected: PASS.

- [ ] **Step 7: Add the Bruno request**

Create `apps/backend/.bruno/analytics/activity.bru`, mirroring `overview.bru` (bearer auth, `{{baseUrl}}`), with `seq: 3`, `params:query { limit: }`, tests for `200`, `items` is an array, and each item carrying `kind`/`source`/`at`, plus docs: response 200/400 (bad `limit`)/401, and the note that the feed is unbounded by range and `limit` is clamped to 50. Leave `overview.bru` and `link-stats.bru` as they are.

- [ ] **Step 8: Commit**

```bash
git add apps/backend/src/analytics apps/backend/test/analytics.spec.ts apps/backend/.bruno/analytics/activity.bru
git commit -m "feat(backend): add the analytics activity feed endpoint"
```

---

### Task 4: Web API types and the activity client

**Files:**

- Modify: `apps/web/src/shared/api/backend/types.ts`
- Create: `apps/web/src/shared/api/backend/analytics/get-activity.ts`
- Modify: `apps/web/src/shared/api/backend/analytics/index.ts`
- Test: `apps/web/src/shared/api/backend/analytics/get-activity.test.ts` (create)

**Interfaces:**

- Consumes: `useApiClient`, `StatsTotals`, `StatsRange`.
- Produces:
  - `SparkPoint`, `ActivityItem` types; `LinkStats.previous`, `OverviewStats.previous`, `OverviewLinkRow.spark`.
  - `ActivityResult { items: ActivityItem[]; failed: boolean }` and `getActivity(limit = 10): Promise<ActivityResult>`, mirroring `getOverview`'s try/catch shape.

- [ ] **Step 1: Write the failing test**

```ts
// apps/web/src/shared/api/backend/analytics/get-activity.test.ts
import { describe, expect, it, vi } from "vitest";

import { getActivity } from "./get-activity";

const { api } = vi.hoisted(() => ({ api: vi.fn() }));

vi.mock("../client", () => ({ useApiClient: () => api }));

describe("getActivity", () => {
  it("asks the endpoint with the limit and returns the items", async () => {
    api.mockResolvedValueOnce({ items: [{ id: "e1", kind: "click" }] });

    expect(await getActivity(5)).toEqual({ items: [{ id: "e1", kind: "click" }], failed: false });
    expect(api).toHaveBeenCalledWith("/analytics/activity", { query: { limit: 5 } });
  });

  /* "we could not ask" is a different fact from "nothing happened", exactly as getOverview already says. */
  it("reports a failure instead of throwing", async () => {
    api.mockRejectedValueOnce(new Error("down"));

    expect(await getActivity()).toEqual({ items: [], failed: true });
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/shared/api/backend/analytics/get-activity.test.ts`
Expected: FAIL — `Cannot find module './get-activity'`.

- [ ] **Step 3: Implement the types and the client**

Add to `types.ts`: `SparkPoint { date: string; views: number }`; the three field additions; and `ActivityItem` exactly as the spec defines it. Create `get-activity.ts` in the shape of `get-overview.ts` (typed return, `try`/`catch → { items: [], failed: true }`). Export it from `analytics/index.ts`.

- [ ] **Step 4: Run the tests and the typecheck**

Run: `pnpm --filter @links/web test`
Expected: PASS (typecheck + vitest).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/shared/api/backend
git commit -m "feat(web): add activity API client and analytics types"
```

---

### Task 5: Metric cards with deltas

**Files:**

- Create: `apps/web/src/widgets/stats-dashboard/model/delta.ts`
- Modify: `apps/web/src/widgets/stats-dashboard/model/index.ts`
- Modify: `apps/web/src/widgets/stats-dashboard/ui/totals-cards.vue`
- Test: `apps/web/src/widgets/stats-dashboard/model/delta.test.ts` (create)
- Test: `apps/web/src/widgets/stats-dashboard/ui/totals-cards.test.ts` (create)
- Modify: `apps/web/src/shared/locales/en-US.ts`, `ru-RU.ts`

**Interfaces:**

- Produces:
  - `DeltaDirection = "up" | "down" | "flat"`, `MetricDelta { direction: DeltaDirection; value: number }`.
  - `countDelta(current: number, previous: number): MetricDelta | null` — `null` when `previous === 0`; `value = Math.round((current - previous) / previous * 100)`; `value === 0` (including rounded `-0`) is `flat`.
  - `pointsDelta(current: number, previous: number): MetricDelta | null` — same `null` rule; `current`/`previous` are rates in `0..1`; `value = Math.round((current - previous) * 100)`.
  - `TotalsCards` props: `{ totals: StatsTotals; previous?: StatsTotals | null; showCtr?: boolean }`.

- [ ] **Step 1: Write the failing model test**

```ts
// apps/web/src/widgets/stats-dashboard/model/delta.test.ts
import { describe, expect, it } from "vitest";

import { countDelta, pointsDelta } from "./delta";

describe("countDelta", () => {
  it("reports a relative change with its direction", () => {
    expect(countDelta(112, 100)).toEqual({ direction: "up", value: 12 });
    expect(countDelta(90, 100)).toEqual({ direction: "down", value: -10 });
    expect(countDelta(100, 100)).toEqual({ direction: "flat", value: 0 });
  });

  /* A rise from nothing has no rate, and a flat zero is not progress: no chip is the honest answer. */
  it("has no delta when the previous window has no baseline", () => {
    expect(countDelta(5, 0)).toBeNull();
    expect(countDelta(0, 0)).toBeNull();
  });
});

describe("pointsDelta", () => {
  it("reports a ratio change in percentage points", () => {
    expect(pointsDelta(0.087, 0.081)).toEqual({ direction: "up", value: 1 });
    expect(pointsDelta(0.081, 0.087)).toEqual({ direction: "down", value: -1 });
  });

  it("has no delta with no baseline rate", () => {
    expect(pointsDelta(0.087, 0)).toBeNull();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/stats-dashboard/model/delta.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `delta.ts`, export it from `model/index.ts`**

- [ ] **Step 4: Write the failing component test**

Mount `TotalsCards` with `totals = { views: 112, visitors: 40, clicks: 12, }` and `previous = { views: 100, visitors: 40, clicks: 6 }`, `showCtr`. Assert: four cards render (three metrics + CTR); the `views` card text contains `+12%`; a card whose previous equals current shows a flat `→ 0%` chip (a delta exists; only a zero baseline suppresses it); with `previous` omitted, no card shows a delta. Assert the CTR delta is `pointsDelta`, not `countDelta`, by giving `totals.clicks/totals.views` and `previous.clicks/previous.views` a known gap. Use `data-metric` attributes to target cards.

- [ ] **Step 5: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/stats-dashboard/ui/totals-cards.test.ts`
Expected: FAIL — no `+12%`.

- [ ] **Step 6: Implement the cards**

Add a lucide icon class per metric (`i-lucide:eye` for views, `i-lucide:users` for visitors, `i-lucide:mouse-pointer-click` for clicks, `i-lucide:percent` for CTR), a big `dd`, and, when `countDelta`/`pointsDelta` returns non-null, a chip with `↑`/`↓`/`→` and `` `${value > 0 ? "+" : ""}${value}%` ``. Compute the CTR rate as `clicks / views` (0 when `views` is 0) for both windows. **Delete the existing comment** that says the overview omits CTR because it averages page rates — the portfolio rate is clicks ÷ views, which is not an average of rates.

- [ ] **Step 7: Add i18n keys** for any new card copy in both locales (metric labels already exist).

- [ ] **Step 8: Run the web tests and make sure they pass**

Run: `pnpm --filter @links/web test`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add apps/web/src/widgets/stats-dashboard apps/web/src/shared/locales
git commit -m "feat(web): show period deltas on the metric cards"
```

---

### Task 6: TrafficChart with a metric toggle

**Files:**

- Create: `apps/web/src/widgets/stats-dashboard/ui/traffic-chart.vue` (renames `visits-chart.vue`)
- Delete: `apps/web/src/widgets/stats-dashboard/ui/visits-chart.vue`, `visits-chart.test.ts`
- Create: `apps/web/src/widgets/stats-dashboard/ui/traffic-chart.test.ts`
- Modify: `apps/web/src/widgets/stats-dashboard/ui/index.ts`
- Modify: `apps/web/src/widgets/stats-dashboard/model/chart-rows.ts` and its test
- Modify: `apps/web/src/pages/index/ui/index-page.vue`, `apps/web/src/pages/links-stats/ui/link-stats-page.vue` (import line only)
- Modify: locales

**Interfaces:**

- Produces:
  - `describeDay(row: ChartRow, metric: ChartMetric): string` where `ChartMetric = "views" | "visitors" | "clicks"` — same `date — value` shape for the chosen metric.
  - `TrafficChart` props `{ points: StatsPoint[]; preset: StatsRangePreset; now: Date }`; it holds the chosen metric internally (`ref<ChartMetric>("views")`), draws an area over it, and renders a `UIToggleGroup` of the three metrics in its header.
  - `ui/index.ts` exports `TrafficChart` instead of `VisitsChart`.

- [ ] **Step 1: Update the failing model test**

Change `describeDay`'s test to pass a metric: `describeDay(row, "clicks")` → `"2026-11-17 — 2"`. Add a case for `"visitors"`.

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/stats-dashboard/model/chart-rows.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `describeDay(row, metric)`** and export `ChartMetric` from `chart-rows.ts` / `model/index.ts`.

- [ ] **Step 4: Write the failing component test**

Adapt the old `visits-chart.test.ts` into `traffic-chart.test.ts`. Keep the `@unovis/vue` mock but export the area components the new template uses (`VisXYContainer` echoing `props.data.length`, `VisArea`, `VisAxis`, `VisTooltip`). Wrap the chart in a `<div data-chart :data-metric="metric" :data-rows="rows.length">`. Assert: one row per day of the range (7, 30, all); quiet days filled with zeros; clicking the `clicks` toggle sets `data-metric="clicks"`; the tooltip describes the chosen metric.

- [ ] **Step 5: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/stats-dashboard/ui/traffic-chart.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 6: Implement `traffic-chart.vue`**

Reuse `withEmptyDays` + `chartRows` + `tickIndexes`. Draw `VisArea` with `:y="(row) => row[metric]"` and a `VisAxis type="x"` unchanged; the gradient is the builder's call from the palette (`piccolo`). Keep `ClientOnly` and the fixed-height box so the card does not jump. Delete `visits-chart.vue`, update `ui/index.ts`, and update the two pages' import names.

- [ ] **Step 7: Add i18n keys** `stats.chart.metric.views|visitors|clicks` in both locales; keep `stats.chart.subtitle`.

- [ ] **Step 8: Run the web tests and make sure they pass**

Run: `pnpm --filter @links/web test`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add apps/web/src/widgets/stats-dashboard apps/web/src/pages apps/web/src/shared/locales
git commit -m "feat(web): draw the traffic chart as an area with a metric toggle"
```

---

### Task 7: ReferrersCard as ranked bars

**Files:**

- Create: `apps/web/src/widgets/stats-dashboard/ui/referrers-card.vue` (renames `sources-table.vue`)
- Delete: `apps/web/src/widgets/stats-dashboard/ui/sources-table.vue`, `sources-table.test.ts`
- Create: `apps/web/src/widgets/stats-dashboard/ui/referrers-card.test.ts`
- Modify: `apps/web/src/widgets/stats-dashboard/ui/index.ts`
- Modify: the two pages' import lines
- Modify: locales

**Interfaces:**

- Produces: `ReferrersCard` props `{ sources: StatsSource[] }`, same data as before, rendered as ranked bars. Keep `data-source` and `data-medium` on each row so the assertions survive, and keep the medium label + the views-share computation unchanged (`share = round(source.views / sum(views) * 100)`, `—` when there are no views).

- [ ] **Step 1: Write the failing test**

Move `sources-table.test.ts` to `referrers-card.test.ts`, rename the import. Keep all four cases (order, views+share, medium labels, empty state) and add: the widest bar belongs to the top source — assert each row's bar carries a `data-share` matching its computed share.

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/stats-dashboard/ui/referrers-card.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `referrers-card.vue`**

List rows: source (bold), the medium beneath it, a bar whose width is the shares relative to the top source (so the leader's bar is full width), the share `%`, and the views. Delete the old file, update `ui/index.ts` and the two page imports.

- [ ] **Step 4: Add i18n keys** if the card needs a new title/empty copy beyond the existing `stats.sources.*`.

- [ ] **Step 5: Run the web tests and make sure they pass**

Run: `pnpm --filter @links/web test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/widgets/stats-dashboard apps/web/src/pages apps/web/src/shared/locales
git commit -m "feat(web): render the source breakdown as ranked referrer bars"
```

---

### Task 8: LinksPerformance with sparklines

**Files:**

- Create: `apps/web/src/widgets/stats-dashboard/model/spark.ts`
- Modify: `apps/web/src/widgets/stats-dashboard/model/index.ts`
- Create: `apps/web/src/widgets/stats-dashboard/ui/links-performance.vue`
- Modify: `apps/web/src/widgets/stats-dashboard/ui/index.ts`
- Test: `apps/web/src/widgets/stats-dashboard/model/spark.test.ts` (create)
- Test: `apps/web/src/widgets/stats-dashboard/ui/links-performance.test.ts` (create)
- Modify: locales

**Interfaces:**

- Produces:
  - `SparkSeries { id: string; values: number[] }`.
  - `sparkSeries(sparks: { id: string; spark: SparkPoint[] }[], preset: StatsRangePreset, now: Date): SparkSeries[]` — every series shares one day span, never each link's own.
  - `LinksPerformance` props `{ links: OverviewLinkRow[]; preset: StatsRangePreset; now: Date }`; rows link to `{ name: "links-id-stats", params: { id } }`, show a monogram (first letter of `title`, uppercased), title, `/{slug}`, clicks, visitors, CTR (`—` when views are 0), and an inline SVG sparkline.

- [ ] **Step 1: Write the failing model test**

```ts
// apps/web/src/widgets/stats-dashboard/model/spark.test.ts
import { describe, expect, it } from "vitest";

import { sparkSeries } from "./spark";

const now = new Date("2026-11-17T12:00:00.000Z");

describe("sparkSeries", () => {
  /* Every spark shares one span: two rows drawn on different spans look comparable and are not. */
  it("gives every link the same days, filling the gaps with zeros", () => {
    const series = sparkSeries(
      [
        {
          id: "a",
          spark: [
            { date: "2026-11-16", views: 3 },
            { date: "2026-11-17", views: 5 },
          ],
        },
        { id: "b", spark: [{ date: "2026-11-17", views: 9 }] },
      ],
      "7d",
      now,
    );

    expect(series.map((s) => s.values.length)).toEqual([7, 7]);
    expect(series[0]?.values).toEqual([0, 0, 0, 0, 0, 3, 5]);
    expect(series[1]?.values).toEqual([0, 0, 0, 0, 0, 0, 9]);
  });

  it("spans the whole portfolio for all time", () => {
    const series = sparkSeries(
      [
        { id: "a", spark: [{ date: "2026-11-10", views: 1 }] },
        { id: "b", spark: [{ date: "2026-11-13", views: 1 }] },
      ],
      "all",
      now,
    );

    expect(series.map((s) => s.values.length)).toEqual([4, 4]);
  });

  it("keeps a page with no rows on the shared span as a flat zero", () => {
    expect(sparkSeries([{ id: "a", spark: [] }], "30d", now)[0]?.values).toEqual(Array.from({ length: 30 }, () => 0));
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/stats-dashboard/model/spark.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `spark.ts`**

The shared span is `withEmptyDays(allSparks.flat(), preset, now).map(d => d.date)` — for `7d`/`30d` that is the fixed range, for `all` the union of every link's rows. Each series maps its own sparse points onto those dates, `0` where absent.

- [ ] **Step 4: Write the failing component test**

Mount `LinksPerformance` with two rows: one with `clicks`/`views` giving a known CTR, one with `views: 0`. Assert: the title and `/{slug}` render; CTR is `10%` and `—`; each row has a `data-spark` element and the flat row's `points` attribute is a horizontal line; the row links to the stats route. Stub `ClientOnly` if used.

- [ ] **Step 5: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/stats-dashboard/ui/links-performance.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 6: Implement `links-performance.vue`**

Inline `<svg viewBox="0 0 100 24" preserveAspectRatio="none">` with a `<polyline>` whose points come from `sparkSeries` (x = index, y scaled to the series' own peak, 1 baseline). Use `NuxtLinkLocale` for the row link, and a `UICard.Root`/`UICard.Header`/`UICard.Title` shell. Export from `ui/index.ts`.

- [ ] **Step 7: Add i18n keys** for the card title and its column heads in both locales.

- [ ] **Step 8: Run the web tests and make sure they pass**

Run: `pnpm --filter @links/web test`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add apps/web/src/widgets/stats-dashboard apps/web/src/shared/locales
git commit -m "feat(web): add the links performance card with sparklines"
```

---

### Task 9: RecentActivity feed

**Files:**

- Create: `apps/web/src/widgets/stats-dashboard/model/relative-time.ts`
- Modify: `apps/web/src/widgets/stats-dashboard/model/index.ts`
- Create: `apps/web/src/widgets/stats-dashboard/ui/recent-activity.vue`
- Modify: `apps/web/src/widgets/stats-dashboard/ui/index.ts`
- Test: `apps/web/src/widgets/stats-dashboard/model/relative-time.test.ts` (create)
- Test: `apps/web/src/widgets/stats-dashboard/ui/recent-activity.test.ts` (create)
- Modify: locales

**Interfaces:**

- Produces:
  - `RelativeUnit = "minute" | "hour" | "day"`, `relativeTime(at: Date, now: Date): { unit: RelativeUnit; count: number }` — `< 60 min` → minute, `< 24 h` → hour, else day; `count` is floored and at least 1.
  - `RecentActivity` props `{ items: ActivityItem[]; now: Date }`; a list of `{ page title · source/medium label · relative time }`, empty state when `items` is empty.

- [ ] **Step 1: Write the failing model test**

```ts
// apps/web/src/widgets/stats-dashboard/model/relative-time.test.ts
import { describe, expect, it } from "vitest";

import { relativeTime } from "./relative-time";

const now = new Date("2026-11-17T12:00:00.000Z");

describe("relativeTime", () => {
  it("counts minutes, then hours, then days", () => {
    expect(relativeTime(new Date("2026-11-17T11:58:00.000Z"), now)).toEqual({ unit: "minute", count: 2 });
    expect(relativeTime(new Date("2026-11-17T09:00:00.000Z"), now)).toEqual({ unit: "hour", count: 3 });
    expect(relativeTime(new Date("2026-11-14T12:00:00.000Z"), now)).toEqual({ unit: "day", count: 3 });
  });

  /* A just-now event reads "1 minute ago", never "0 minutes ago". */
  it("never counts zero", () => {
    expect(relativeTime(now, now)).toEqual({ unit: "minute", count: 1 });
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/stats-dashboard/model/relative-time.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `relative-time.ts`** and export it from `model/index.ts`.

- [ ] **Step 4: Write the failing component test**

Mount `RecentActivity` with two items (one click with a `t.me` source, one view `direct`) and a fixed `now`. Assert the text names the page title, the source, and the relative phrase; assert the click shows its block marker and the view does not. Mount with `items: []` and assert the empty-state element exists.

- [ ] **Step 5: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/stats-dashboard/ui/recent-activity.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 6: Implement `recent-activity.vue`**

A `UICard` shell, a list of dots + text, `t(\`stats.activity.ago.${unit}\`, { n: count })`. Keep the whole card under 200 lines. Export from `ui/index.ts`.

- [ ] **Step 7: Add i18n keys** for the title, the empty state and the three relative forms in both locales.

- [ ] **Step 8: Run the web tests and make sure they pass**

Run: `pnpm --filter @links/web test`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add apps/web/src/widgets/stats-dashboard apps/web/src/shared/locales
git commit -m "feat(web): add the recent activity feed"
```

---

### Task 10: Wire both pages, then the full gate

**Files:**

- Modify: `apps/web/src/pages/index/ui/index-page.vue`
- Modify: `apps/web/src/pages/links-stats/ui/link-stats-page.vue`
- Modify: both pages' tests (`index-page.test.ts`, `link-stats-page.test.ts`)
- Modify: locales for the page header/subtitle

**Interfaces:**

- Consumes: `AnalyticsApi.getActivity`, `OverviewStats.previous`, `LinkStats.previous`, `OverviewStats.links[].spark`, and every widget from Tasks 5–9.
- Produces: the overview page requesting the activity feed once on mount (no range dependency) and rendering `TotalsCards` (with `previous`), `TrafficChart`, `ReferrersCard`, `RecentActivity`, `LinksPerformance`; the per-page screen rendering `TotalsCards` (with `previous`), `TrafficChart`, `ReferrersCard` and the existing per-block table.

- [ ] **Step 1: Update the page tests (fail first)**

In `index-page.test.ts`, assert the overview renders a `LinksPerformance` row per link and a `RecentActivity` region, and that the old standalone links table is gone. In `link-stats-page.test.ts`, assert the cards receive `previous` and that no activity region renders on the per-page screen. Mock `AnalyticsApi.getActivity` to return items.

- [ ] **Step 2: Run them to verify they fail**

Run: `pnpm --filter @links/web exec vitest run src/pages/index/ui/index-page.test.ts src/pages/links-stats/ui/link-stats-page.test.ts`
Expected: FAIL.

- [ ] **Step 3: Wire the overview page**

Pass `:previous="stats.previous"` and `show-ctr` to `TotalsCards`; replace the visits chart/sources table imports with the new widgets; add `links-performance` with `:links="stats.links" :preset="preset" :now="now"`; fetch activity on mount into a `ref<ActivityItem[]>` (do not re-fetch on range change) and render `recent-activity`. Replace the inline `UITable` links block.

- [ ] **Step 4: Wire the per-page screen**

Pass `:previous="stats.previous"` and `show-ctr` to `TotalsCards`; swap chart/sources widgets; keep the per-block table; add no activity region.

- [ ] **Step 5: Add the page header keys** (`stats.analytics.title`, `stats.analytics.subtitle`) in both locales and use them in the overview header.

- [ ] **Step 6: Run the web tests and make sure they pass**

Run: `pnpm --filter @links/web test`
Expected: PASS.

- [ ] **Step 7: Run the full gate**

Run: `pnpm verify`
Expected: `lint` + `fmt` + `build` + `test` all pass. If `fmt` flags files, run `pnpm fmt:write` and amend the task's commit before continuing.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/pages apps/web/src/shared/locales
git commit -m "feat(web): compose the analytics dashboards from the new widgets"
```
