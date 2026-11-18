# Links Page Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/links` from a bare table into the dashboard the mockup draws: a header with the range
picker, four metric cards with deltas and sparklines, and a "Your Links" card that pages the owner's pages
with their own clicks and visitor counts.

**Architecture:** The page fetches `GET /analytics/overview` for the numbers and the links store for the
rows, and joins them by id in a model function. The cards come from the existing `stats-dashboard` widget
set, which gains a sparkline; the table is the reworked `multilinks-list` widget. One additive field on the
link DTO supplies the "Updated" column.

**Tech Stack:** NestJS + TypeORM (backend); Nuxt + Vue 3 + UnoCSS `@links/ui` (web); vitest +
`@vue/test-utils` + supertest (tests).

**Spec:** `docs/superpowers/specs/2026-11-18-links-page-dashboard-design.md`

## Global Constraints

- Labels: `Visitors (per day)` and `Clicks` stay as they are; the mockup's "Unique Visitors" is not used.
- No literal colours: surfaces `bg-gohan`, text `text-bulma` / `text-trunks`, accents from the palette
  tokens. The mockup's dark look is the app's dark theme.
- No new dependency, no schema change, no migration, no `@links/ui` source change.
- i18n keys go into **both** `apps/web/src/shared/locales/en-US.ts` and `ru-RU.ts`.
- Every type-only import is `import type` (SWC emits no type information on the backend).
- Conventional commits, one per task. Behaviour change and its doc change ship together.
- Verification floor: `pnpm --filter @links/backend test`, `pnpm --filter @links/web test`, `pnpm verify`.

## Review Focus

1. **The overview request fails.** The screen must show the failed card and no metric cards and no rows —
   never a dashboard of zeros. Test: Task 5.
2. **A page the overview has no rows for.** Its row reads zero clicks and zero visitors, not a blank cell,
   and the join must not reorder the list. Test: Task 3.
3. **A day with no views on the CTR sparkline.** The day's rate is 0, never `NaN`/`Infinity`. Test: Task 2.
4. **A deletion that empties the last page.** The reader must not be left on a page the list no longer has.
   Test: Task 4.
5. **A page whose `updatedAt` is missing or unparsable.** The cell must not print "Invalid Date". Test:
   Task 4.

---

### Task 1: The page's update time on the link DTO

**Files:**

- Modify: `apps/backend/src/links/link.dto.ts`
- Test: `apps/backend/test/links.spec.ts` (create)
- Modify: `apps/web/src/shared/api/backend/types.ts` (`Link.updatedAt`)

**Interfaces:**

- Produces: `LinkDto.updatedAt: string` (ISO), present on `POST /links`, `GET /links`, `GET /links/:id`;
  web `Link.updatedAt: string`.

- [ ] **Step 1: Write the failing test**

```ts
// apps/backend/test/links.spec.ts
describe("links", () => {
  it("carries the page's update time as an ISO string", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/links").send({ slug: "updated-at", title: "A page with a timestamp" });

    expect(created.status).toBe(201);
    expect(Number.isNaN(Date.parse(created.body.updatedAt as string))).toBe(false);
    expect((await agent.get("/links")).body[0].updatedAt).toBeTypeOf("string");
  });
});
```

(`beforeAll`/`afterAll` copy `links.theme.spec.ts`.)

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/backend exec vitest run test/links.spec.ts`
Expected: FAIL — `updatedAt` is `undefined`.

- [ ] **Step 3: Add the field**

`LinkDto` gains `updatedAt: string;` with a doc comment saying it is the page's own update time and what the
list screen reads it for; `toLinkDto` returns `link.updatedAt.toISOString()`. Add `updatedAt: string;` to the
web `Link` interface in the same shape.

- [ ] **Step 4: Run the tests and make sure they pass**

Run: `pnpm --filter @links/backend test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/backend/src/links/link.dto.ts apps/backend/test/links.spec.ts apps/web/src/shared/api/backend/types.ts
git commit -m "feat(backend): expose a page's update time on the link DTO"
```

---

### Task 2: A sparkline on each metric card

**Files:**

- Create: `apps/web/src/widgets/stats-dashboard/model/spark.ts`
- Modify: `apps/web/src/widgets/stats-dashboard/model/index.ts`
- Create: `apps/web/src/widgets/stats-dashboard/ui/spark-line.vue`
- Modify: `apps/web/src/widgets/stats-dashboard/ui/totals-cards.vue`
- Test: `apps/web/src/widgets/stats-dashboard/model/spark.test.ts` (create)
- Test: `apps/web/src/widgets/stats-dashboard/ui/totals-cards.test.ts` (extend)

**Interfaces:**

- Produces: `SparkMetric = ChartMetric | "ctr"`;
  `metricSpark(points: StatsPoint[], metric: SparkMetric, preset: StatsRangePreset, now: Date): number[]` —
  one number per day of the range.
- Produces: `SparkLine` props `{ values: number[] }`, rendering `<svg data-spark :data-points>`.
- Produces: `TotalsCards` props gain `points?: StatsPoint[]; preset?: StatsRangePreset; now?: Date`; card
  order becomes clicks, visitors, views, CTR (CTR last, only with `showCtr`).

- [ ] **Step 1: Write the failing model test**

```ts
// spark.test.ts
const now = new Date("2026-11-17T12:00:00.000Z");
const points: StatsPoint[] = [{ date: "2026-11-17", views: 4, visitors: 2, clicks: 2 }];

it("gives one number per day of the range", () => {
  expect(metricSpark(points, "clicks", "7d", now)).toEqual([0, 0, 0, 0, 0, 0, 2]);
});

/* CTR has no series of its own: the day's rate is that day's clicks over its views, and a quiet day is 0. */
it("derives CTR per day and never divides by zero", () => {
  expect(metricSpark(points, "ctr", "7d", now).at(-1)).toBe(0.5);
  expect(metricSpark([], "ctr", "7d", now)).toEqual(Array.from({ length: 7 }, () => 0));
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/stats-dashboard/model/spark.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `spark.ts`**

`withEmptyDays(points, preset, now)` then map: `ctr` → `day.views ? day.clicks / day.views : 0`, otherwise
`day[metric]`. Export from `model/index.ts`.

- [ ] **Step 4: Implement `spark-line.vue`**

A 100×24 box, an inline `<polyline>` scaled to the series' own peak and inset by 2 so a flat line sits on the
baseline: `x = index / (n - 1) * 100`, `y = 22 - (value / peak) * 20`; an all-zero series draws the flat
baseline. `preserveAspectRatio="none"`, `vector-effect="non-scaling-stroke"`, stroke `currentColor`, and
`data-points` on the svg so a test reads the geometry.

- [ ] **Step 5: Wire the cards and extend their test**

`TotalsCards` gains the three optional props, drops the CTR card to last, and renders
`<SparkLine v-if="points?.length" class="ms-auto self-center text-piccolo" :values="…">` in the card's body.
Extend `totals-cards.test.ts`: the card order is `["clicks", "visitors", "views", "ctr"]`; with `points` and
`preset` every card has `[data-spark]`; without `points` none does.

- [ ] **Step 6: Run the web tests**

Run: `pnpm --filter @links/web test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/widgets/stats-dashboard
git commit -m "feat(web): draw a sparkline of the range on each metric card"
```

---

### Task 3: Joining the owner's pages with their metrics

**Files:**

- Create: `apps/web/src/widgets/multilinks-list/model/rows.ts`, `model/index.ts`
- Modify: `apps/web/src/widgets/multilinks-list/index.ts`
- Test: `apps/web/src/widgets/multilinks-list/model/rows.test.ts` (create)

**Interfaces:**

- Produces: `LinksListRow { id; title; slug; status: LinkStatus; updatedAt: string; clicks: number;
  visitors: number }` and `linksRows(links: Link[], metrics: OverviewLinkRow[]): LinksListRow[]`.

- [ ] **Step 1: Write the failing test**

```ts
it("keeps the list's order and reads a page with no metrics as zeros", () => {
  const rows = linksRows(
    [link("a", "my-page"), link("b", "blog")],
    [{ id: "b", slug: "blog", title: "Blog", views: 9, visitors: 4, clicks: 3, spark: [] }],
  );

  expect(rows.map((row) => row.slug)).toEqual(["my-page", "blog"]);
  expect(rows[0]).toMatchObject({ clicks: 0, visitors: 0, status: "PUBLISHED", updatedAt: "2026-11-08T00:00:00.000Z" });
  expect(rows[1]).toMatchObject({ clicks: 3, visitors: 4 });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/multilinks-list/model/rows.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `rows.ts` and export it** from `model/index.ts` and the widget's `index.ts`.

- [ ] **Step 4: Run the test**

Run: `pnpm --filter @links/web exec vitest run src/widgets/multilinks-list/model/rows.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/widgets/multilinks-list
git commit -m "feat(web): join a page's row with the metrics the overview counts for it"
```

---

### Task 4: The "Your Links" card

**Files:**

- Modify: `apps/web/src/widgets/multilinks-list/ui/multilinks-list.vue`
- Modify: `apps/web/src/widgets/multilinks-list/ui/link-actions.vue`
- Modify: `apps/web/src/shared/locales/en-US.ts`, `ru-RU.ts`
- Test: `apps/web/src/widgets/multilinks-list/ui/multilinks-list.test.ts` (create)

**Interfaces:**

- Consumes: `LinksListRow` (Task 3), `CreateNewLinkDialog` + `CreateNewLinkForm`, `ShareLinkDialog`.
- Produces: `MultilinksList` props `{ links: LinksListRow[]; loading?: boolean }`, emit `deleted`; the card
  header holds the title and the `+ Create Link` action, the body the table, the footer the page-size select
  and `UIPagination`.

- [ ] **Step 1: Write the failing test**

Mount the widget with 11 rows and `perPage` 10: 10 rows render, the pagination's second page shows the 11th;
the header holds a Create Link trigger; with no rows the empty state renders and the footer does not. Also
assert a row's cell shows a medium-formatted date, and that both the statistics and the constructor link are
in the row's actions.

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/multilinks-list/ui/multilinks-list.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement the card**

`UICard.Root` / `Header` (row: title with its icon, then `CreateNewLinkDialog` wrapping `CreateNewLinkForm`
as a `+ Create Link` button) / `Body` (the table) / `Footer`. The table's cells: monogram tile + title +
`/{slug}` + the status tag; the public address as a link with an icon-only copy button that toasts on copy;
clicks; visitors; `Intl.DateTimeFormat(locale, { dateStyle: "medium" })` over `updatedAt`, guarded against an
unparsable value; actions. `perPage`/`page` are local refs, sliced with `slice((page - 1) * perPage, page * perPage)`,
and a watch clamps `page` to the last page the list still has. A row with no title and no slug is not a case
this screen can produce, so no fallback copy.

- [ ] **Step 4: Rework `link-actions.vue`**

Statistics as an icon-only button to `links-id-stats`, `Edit` to `links-constructor-id`, and a `…`
`UIDropdownMenu` holding Preview, Share (the `ShareLinkDialog`) and Delete. Delete calls the store and emits
`deleted` upward so the page refetches. Keep the existing mobile behaviour: the dropdown is the whole bar
below `sm`, no separate share button.

- [ ] **Step 5: Add the i18n keys** to both locales.

- [ ] **Step 6: Run the web tests**

Run: `pnpm --filter @links/web test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/widgets/multilinks-list apps/web/src/shared/locales
git commit -m "feat(web): restyle the links card with the range's metrics and pagination"
```

---

### Task 5: The page as a dashboard

**Files:**

- Modify: `apps/web/src/pages/links/ui/links-list-page.vue`
- Modify: `apps/web/src/widgets/stats-dashboard/model/use-stats-range.ts` (optional initial preset)
- Modify: `apps/web/src/shared/locales/en-US.ts`, `ru-RU.ts`
- Test: `apps/web/src/pages/links/ui/links-list-page.test.ts` (create)

**Interfaces:**

- Consumes: `AnalyticsApi.getOverview`, `useLinksStore`, `linksRows` (Task 3), `RangePicker`,
  `TotalsCards` (Task 2), `MultilinksList` (Task 4), `useStatsRange(now, "30d")`.
- Produces: the page owning `now`, `preset`, `range`, the two reads, the join, and the header.

- [ ] **Step 1: Write the failing test**

Mock `AnalyticsApi.getOverview` and the links store the way `index-page.test.ts` mocks the API. Assert: the
heading and subtitle render; four `[data-metric]` cards carry the overview's numbers; one row per page from
the store's list; a failed overview renders `[data-testid='stats-failed']` and no rows.

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/pages/links/ui/links-list-page.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement the page**

`useStatsRange(now, "30d")`; `load()` awaits `getOverview(range)` and `linksStore.refreshLinksList()` together,
so the cards and the rows describe one moment; `rows = computed(() => linksRows(links.value, stats.value?.links ?? []))`;
the template is `main` → header (icon tile, heading, subtitle, `RangePicker`) → failed card / skeletons /
`TotalsCards` + `MultilinksList`, with `@deleted="load"`.

- [ ] **Step 4: Add the page's i18n keys** to both locales, including the subtitle the mockup prints.

- [ ] **Step 5: Run the web tests**

Run: `pnpm --filter @links/web test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/pages/links apps/web/src/widgets/stats-dashboard/model/use-stats-range.ts apps/web/src/shared/locales
git commit -m "feat(web): compose the links page from the metric cards and the links card"
```

---

### Task 6: The gate

- [ ] **Step 1: Run the whole gate**

Run: `pnpm verify`
Expected: `lint`, `fmt`, `build` and the tests all pass. If `fmt` flags files, `pnpm fmt:write` and amend the
owning task's commit.

- [ ] **Step 2: Exercise the screen in a browser**

Sign in against a running backend, open `/links`, and read back: four cards with numbers, one row per page
with its link, clicks, visitors and update time, the copy button's toast, a page change, and the Create Link
sheet opening. Check the dark theme too — the tokens flip, nothing on the screen is hard-coded.
