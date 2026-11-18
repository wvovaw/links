# Links Page Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/links` from a bare table into the dashboard the mockup draws: a header with the range
picker, four metric cards with deltas and sparklines, and a "Your Links" card that pages the owner's pages
with their own clicks and visitor counts.

**Architecture:** The page fetches `GET /analytics/overview` for the numbers and the links store for the
rows, and joins them by id in a model function. The cards come from the existing `stats-dashboard` widget
set, whose chart becomes one shared component the cards and the screens both draw with; the table is the
reworked `multilinks-list` widget. One additive field on the
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

### Task 2: One chart, drawn small in the cards

**Files:**

- Create: `apps/web/src/widgets/stats-dashboard/ui/series-chart.vue`
- Modify: `apps/web/src/widgets/stats-dashboard/model/chart-rows.ts` (the day's own CTR, `SparkMetric`)
- Modify: `apps/web/src/widgets/stats-dashboard/ui/traffic-chart.vue` (keeps the card shell and the toggle)
- Modify: `apps/web/src/widgets/stats-dashboard/ui/totals-cards.vue`
- Test: `apps/web/src/widgets/stats-dashboard/ui/series-chart.test.ts` (create)
- Test: `apps/web/src/widgets/stats-dashboard/model/chart-rows.test.ts` (extend)
- Test: `apps/web/src/widgets/stats-dashboard/ui/totals-cards.test.ts` (extend)

**Interfaces:**

- Produces: `ChartRow.ctr: number` — the day's own rate, `0` when the day had no views; `SparkMetric =
  ChartMetric | "ctr"`.
- Produces: `SeriesChart` props `{ points: StatsPoint[]; preset: StatsRangePreset; now: Date; metric:
  SparkMetric; compact?: boolean }`. Compact draws a bare `VisLine` in an 80×24 box with
  `:prevent-empty-domain="true"`; otherwise a `VisArea` with the gradient, the axis, the crosshair and the
  tooltip at `:height="128"`. `:prevent-empty-domain` stays **undefined** when not compact — the library's
  own default already guards the big chart, and `false` would turn it off.
- Produces: `TotalsCards` props gain `series?: { points: StatsPoint[]; preset: StatsRangePreset; now: Date }`;
  card order becomes clicks, visitors, CTR, views (CTR only with `showCtr`).

- [ ] **Step 1: Write the failing model test**

```ts
// chart-rows.test.ts
it("carries each day's own CTR, and no rate for a day with no views", () => {
  const rows = chartRows([
    { date: "2026-11-16", views: 0, visitors: 0, clicks: 3 },
    { date: "2026-11-17", views: 4, visitors: 2, clicks: 1 },
  ]);

  expect(rows[0]?.ctr).toBe(0);
  expect(rows[1]?.ctr).toBe(0.25);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/stats-dashboard/model/chart-rows.test.ts`
Expected: FAIL — `ctr` is `undefined`.

- [ ] **Step 3: Implement the CTR column** in `chartRows`, and move `SparkMetric` into `chart-rows.ts`.

- [ ] **Step 4: Write the failing component test**

Mock `@unovis/vue` the way `traffic-chart.test.ts` does, then assert: one row per day of the range, zeros
included; compact finds a `VisLine` and no `VisArea`/`VisAxis`/`VisCrosshair`/`VisTooltip`, and asks for
`prevent-empty-domain`; the full chart finds the area, the axis and the crosshair, and leaves
`prevent-empty-domain` unset; the line's `y` accessor reads the metric it was asked for, CTR included.

- [ ] **Step 5: Run it to verify it fails, then implement `series-chart.vue`**

Run: `pnpm --filter @links/web exec vitest run src/widgets/stats-dashboard/ui/series-chart.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 6: Shrink `traffic-chart.vue` to the shell and the toggle, and wire the cards**

`TrafficChart` keeps `UICard.Root`/`Header`/`Title`, the subtitle and the toggle, holds the chosen metric, and
renders `<SeriesChart … :metric="metric">`. `TotalsCards` renders `<SeriesChart compact :metric="metric.spark">`
in each card's body, and reorders its cards. Extend `totals-cards.test.ts`: with `series` every card has a
`[data-chart]` carrying its own `data-metric` and the range's `data-rows`; without it none does.

- [ ] **Step 7: Run the web tests**

Run: `pnpm --filter @links/web test`
Expected: PASS — `traffic-chart.test.ts` unchanged, because the chart behaves as it did.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/widgets/stats-dashboard
git commit -m "feat(web): draw the cards and the screens with one chart"
```

---

### Task 3: The owner's pages
