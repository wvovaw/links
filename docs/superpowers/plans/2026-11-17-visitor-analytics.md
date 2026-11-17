# Visitor Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A page reports its own visits with their traffic source, block clicks keep working and gain the
same source data, and the owner reads both as a dashboard on the home screen and per page.

**Architecture:** Raw event rows in two SQLite tables (`page_views`, `block_events`), aggregated at read
time with `GROUP BY`. A public beacon writes; an authenticated controller reads. No visitor is stored —
only a daily-rotating SHA-256 hash. Sources are stored raw and classified on read.

**Tech Stack:** NestJS 12 + TypeORM + better-sqlite3 (backend), Nuxt 4 + Vue 3 + Pinia + UnoCSS
(`@links/ui`) for the screens, vitest + supertest + `@vue/test-utils` for tests.

**Spec:** `docs/superpowers/specs/2026-11-17-visitor-analytics-design.md`

## Global Constraints

- Schema changes go through migrations in `apps/backend/src/migrations/` only. `synchronize` is off.
- Every type-only import uses `import type` — SWC has no type information, and a plain import of a
  type reaches the runtime graph and fails to resolve (`docs/conventions.md`).
- Days are UTC everywhere: the salt's day, `date(createdAt)`, and the axis label.
- No IP, no user agent, no cookie, no `localStorage` may be stored. The only visitor artefact is the
  16-character hex hash from `visitorHashOf`.
- A beacon never throws and never blocks navigation.
- New i18n keys go into both `src/shared/locales/en-US.ts` and `ru-RU.ts`.
- No new dependency for charts or dates.
- Commits: conventional commits; one per task, at the end of the task.
- Verification floor per package: `pnpm --filter @links/backend test`, `pnpm --filter @links/web test`,
  and `pnpm verify` at the end.

## Review Focus

1. **A visitor reloading a page repeatedly** — the 11th reload inside a minute must answer 429 and store
   nothing, while a second visitor on the same page is unaffected. Test: Task 5.
2. **A visit with both `?utm_source=` and an external referrer** — utm wins, and the referrer does not
   also appear as a separate source. Test: Task 7.
3. **A body carrying `ip`, `userAgent` or `linkId`** — 400, nothing stored. Test: Task 4.
4. **A view reported for a draft page** — 404, and no row, so the endpoint does not confirm the slug
   exists. Test: Task 5.
5. **Click rows written before this change** — they keep their click counts, count as zero distinct
   clickers, and classify as `direct`. Test: Task 6.

---

### Task 1: Evict stale keys in `SlidingWindow`

**Files:**

- Modify: `apps/backend/src/common/sliding-window.ts`
- Test: `apps/backend/test/sliding-window.spec.ts` (create)

**Interfaces:**

- Consumes: nothing.
- Produces: `SlidingWindow` keeps its constructor and `admit(scope, key, messages)` signature, and gains
  `get keyCount(): number` and `get scopeCount(): number` — how many entries the two maps hold right now.

- [ ] **Step 1: Write the failing test**

Test name `"drops a key whose window has emptied"`. Cases in `sliding-window.spec.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";

import { SlidingWindow } from "../src/common/sliding-window";

const messages = { key: "key refused", scope: "scope refused" };
const limits = { perKey: 2, perScope: 3 };
```

- `"drops a key whose window has emptied"` — admit `("page-1", "page-1:a")`, advance the clock 61s with
  `vi.useFakeTimers()` + `vi.setSystemTime`, admit `("page-1", "page-1:b")`, expect `keyCount` to be `1`
  and `scopeCount` to be `1`.
- `"keeps a key still inside its window"` — admit `("page-1", "page-1:a")` twice, advance 30s, admit
  `("page-1", "page-1:b")`, expect `keyCount` to be `2`.
- `"still refuses the third request for one key in a minute"` — three admits on the same key inside one
  minute, expect the third to throw with `messages.key`.

- [ ] **Step 2: Run it and watch it fail**

Run: `pnpm --filter @links/backend test -- sliding-window`
Expected: FAIL — `keyCount` is not a function (or `undefined`).

- [ ] **Step 3: Implement the sweep**

In `admit()`, before resolving the two windows, drop every entry whose timestamps have all aged out:
iterate `keys` and `scopes`, and `delete` each key whose `recent()` result is empty. Then continue as
today. `keyCount` / `scopeCount` return `this.keys.size` / `this.scopes.size`. Update the class comment:
the sweep is what keeps memory bounded once a key is traffic rather than content.

- [ ] **Step 4: Run the tests**

Run: `pnpm --filter @links/backend test -- sliding-window`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add apps/backend/src/common/sliding-window.ts apps/backend/test/sliding-window.spec.ts
git commit -m "fix(backend): evict aged-out keys from the rate-limit window"
```

---

### Task 2: `page_views` table and entity

**Files:**

- Create: `apps/backend/src/analytics/page-view.entity.ts`
- Create: `apps/backend/src/migrations/<timestamp>-AddPageViews.ts`
- Modify: `apps/backend/src/database/database.config.ts` (entity list)
- Modify: `apps/backend/src/analytics/analytics.module.ts` (`TypeOrmModule.forFeature`)
- Test: `apps/backend/test/analytics.spec.ts` (extend)

**Interfaces:**

- Consumes: nothing.
- Produces: `class PageView` with `id: string`, `linkId: string`, `link: Link`, `utmSource: string | null`,
  `utmMedium: string | null`, `utmCampaign: string | null`, `referrerHost: string | null`,
  `referrerInternal: boolean`, `visitorHash: string`, `createdAt: Date`.

- [ ] **Step 1: Write the entity**

`@Entity("page_views")`, uuid primary key, `@ManyToOne(() => Link, { onDelete: "CASCADE" })` on
`linkId`, the six source columns, `visitorHash` as `varchar` **not null**, `@CreateDateColumn()`. Two
indexes: `@Index(["linkId", "createdAt"])` and `@Index(["linkId", "visitorHash"])`. The doc comment
carries the spec's reasoning: one row per page load, no counter row, nothing that identifies a visitor.

- [ ] **Step 2: Register the entity**

Add `PageView` to `entities` in `database.config.ts` and to `TypeOrmModule.forFeature([...])` in
`analytics.module.ts`.

- [ ] **Step 3: Generate and hand-write the migration**

Run, from `apps/backend`: `pnpm migration:show` (run anything pending first — generation diffs against
the current database), then `pnpm migration:generate src/migrations/AddPageViews`, then `pnpm migration:run`.

Rewrite the generated file in the style of
`src/migrations/1794770895055-AddBlockEvents.ts`: hand-written `CREATE TABLE` with the `CONSTRAINT
"FK_…" FOREIGN KEY ("linkId") REFERENCES "links" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`, two
`CREATE INDEX` statements, a matching `down()` that drops what `up()` created, and a class comment
saying why the table exists and why the foreign key cascades.

- [ ] **Step 4: Write the failing test**

In `apps/backend/test/analytics.spec.ts`, add `"deletes views with the page"`: publish a page, insert a
`PageView` row through `app.get(DataSource).getRepository(PageView)`, delete the link through the owner's
agent (`DELETE /links/:id`, expect 204), then expect the row count for that `linkId` to be `0`.

- [ ] **Step 5: Run it**

Run: `pnpm --filter @links/backend test -- analytics`
Expected: PASS once the migration and entity are right. If the insert fails, the entity and the migration
disagree — fix the migration, never `synchronize`.

- [ ] **Step 6: Commit**

```bash
git add apps/backend/src/analytics/page-view.entity.ts apps/backend/src/migrations apps/backend/src/database/database.config.ts apps/backend/src/analytics/analytics.module.ts apps/backend/test/analytics.spec.ts
git commit -m "feat(backend): store one row per page view"
```

---

### Task 3: The visitor hash

**Files:**

- Create: `apps/backend/src/analytics/visitor-hash.ts`
- Test: `apps/backend/test/visitor-hash.spec.ts` (create)

**Interfaces:**

- Consumes: nothing.
- Produces: `visitorHashOf(input: { ip: string; userAgent: string; at: Date }): string` — 16 lowercase
  hex characters.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";

import { visitorHashOf } from "../src/analytics/visitor-hash";

const base = { ip: "203.0.113.7", userAgent: "Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101" };
const day = new Date("2026-11-17T10:00:00.000Z");
```

- `"is stable for one visitor on one day"` — two calls with `{ ...base, at: day }` are equal.
- `"rotates with the day"` — same inputs, `at` 24h later, differ.
- `"does not carry the address"` — the output contains neither `"203.0.113.7"` nor `"203"`.
- `"is sixteen hex characters"` — matches `/^[0-9a-f]{16}$/`.
- `"ignores the time inside one UTC day"` — `10:00Z` and `23:59Z` on the same date are equal.

- [ ] **Step 2: Run it and watch it fail**

Run: `pnpm --filter @links/backend test -- visitor-hash`
Expected: FAIL — cannot resolve `../src/analytics/visitor-hash`.

- [ ] **Step 3: Implement it**

`node:crypto` `createHash("sha256")` over `` `${ip}|${userAgent.slice(0, 256)}|${dailySalt(at)}` ``, hex,
first 16 characters. `dailySalt(at)` = `sha256(`${process.env.ANALYTICS_SALT ?? process.env.JWT_SECRET ?? "links-dev"}|${at.toISOString().slice(0, 10)}`)`.
The file's doc comment states the three properties the tests pin and the consequence: uniques are per
UTC day, so a range's visitor count is a sum.

- [ ] **Step 4: Run the tests**

Run: `pnpm --filter @links/backend test -- visitor-hash`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add apps/backend/src/analytics/visitor-hash.ts apps/backend/test/visitor-hash.spec.ts
git commit -m "feat(backend): derive a daily visitor hash that stores nothing"
```

---

### Task 4: The source DTO and its normalisation

**Files:**

- Create: `apps/backend/src/analytics/source.ts`
- Create: `apps/backend/src/analytics/dto/event-source.dto.ts`
- Modify: `apps/backend/src/analytics/dto/block-event.dto.ts` (extend the source, rename the query DTO)
- Test: `apps/backend/test/source.spec.ts` (create)

**Interfaces:**

- Consumes: nothing.
- Produces:
  - `class EventSourceDto` with optional `utmSource`, `utmMedium`, `utmCampaign`, `referrerHost`
    (strings) and `referrerInternal` (boolean).
  - `class RecordPageViewDto extends EventSourceDto` — no extra fields.
  - `class RecordBlockEventDto extends EventSourceDto` — adds `blockId`, `kind`.
  - `class StatsQueryDto` — `from?`, `to?` (renamed from `BlockStatsQueryDto`).
  - `interface SourceColumns { utmSource: string | null; utmMedium: string | null; utmCampaign: string | null; referrerHost: string | null; referrerInternal: boolean }`
  - `toSourceColumns(dto: EventSourceDto): SourceColumns`

- [ ] **Step 1: Write the failing test**

`source.spec.ts`, describing `toSourceColumns`:

- `"lowercases and trims utm tags"` — `{ utmSource: "  Telegram ", utmMedium: "Social" }` → `"telegram"`, `"social"`.
- `"caps a long tag at 100 characters"` — a 200-char `utmCampaign` → length 100.
- `"strips www and lowercases the host"` — `{ referrerHost: "WWW.Google.COM" }` → `"google.com"`.
- `"caps a host at 253 characters"`.
- `"keeps an empty tag as null"` — `{ utmSource: "   " }` → `null`.
- `"defaults every absent field to null and internal to false"` — `toSourceColumns({})` equals
  `{ utmSource: null, utmMedium: null, utmCampaign: null, referrerHost: null, referrerInternal: false }`.

- [ ] **Step 2: Run it and watch it fail**

Run: `pnpm --filter @links/backend test -- source.spec`
Expected: FAIL — cannot resolve `../src/analytics/source`.

- [ ] **Step 3: Implement the DTO and the normaliser**

`EventSourceDto` fields: `@IsOptional() @IsString() @MaxLength(100)` for the three utm fields,
`@MaxLength(253)` for `referrerHost`, `@IsOptional() @IsBoolean()` for `referrerInternal`. Class comment:
naming each field is what makes the global `forbidNonWhitelisted` pipe reject an `ip` or a `userAgent`
sent by a hostile client.

`toSourceColumns` trims, lowercases, caps, converts empty to `null`, strips a leading `www.` from the
host, and defaults `referrerInternal` to `false`.

Rename `BlockStatsQueryDto` to `StatsQueryDto` in `block-event.dto.ts` and update its two importers
(`analytics.service.ts`, `links.controller.ts`).

- [ ] **Step 4: Run the tests**

Run: `pnpm --filter @links/backend test -- source.spec`
Expected: PASS, 6 tests.

- [ ] **Step 5: Write the rejection test for a click body**

In `apps/backend/test/analytics.spec.ts`, add `"refuses a click body that carries visitor data"`: post
`{ blockId: "b1", kind: "click", ip: "1.2.3.4" }` to `/public/links/:slug/events` and expect `400`. The
matching case for a view body is written in Task 5, where that route exists for the first time.

- [ ] **Step 6: Run it**

Run: `pnpm --filter @links/backend test -- analytics`
Expected: PASS — the pipe already rejects the unknown field; the test is here so the new
`RecordBlockEventDto` inheritance cannot quietly widen what the endpoint accepts.

- [ ] **Step 7: Commit**

```bash
git add apps/backend/src/analytics apps/backend/test/source.spec.ts apps/backend/test/analytics.spec.ts
git commit -m "feat(backend): accept and normalise the traffic source"
```

---

### Task 5: `POST /public/links/:slug/views`

**Files:**

- Modify: `apps/backend/src/analytics/analytics.service.ts` (add `recordView`)
- Modify: `apps/backend/src/public/public-events.controller.ts` (add the route)
- Modify: `apps/backend/src/configure-app.ts` (`trust proxy`)
- Test: `apps/backend/test/analytics.spec.ts` (extend)

**Interfaces:**

- Consumes: `visitorHashOf` (Task 3), `toSourceColumns` + `RecordPageViewDto` (Task 4), `PageView`
  (Task 2), the evicting `SlidingWindow` (Task 1).
- Produces:
  - `AnalyticsService.recordView(linkId: string, visitorHash: string, source: SourceColumns): Promise<void>`
  - `AnalyticsService.viewWindow` — a private `new SlidingWindow({ perKey: 10, perScope: 300 })`.
  - `POST /public/links/:slug/views` → `{ ok: true }`.

- [ ] **Step 1: Set the proxy hop**

In `configureApp()`, before the pipes: `app.getHttpAdapter().getInstance().set("trust proxy", 1)`. Comment:
one hop (nginx/traefik) in front; without it every visitor behind the proxy hashes to the same value and a
page reports one unique visitor regardless of traffic.

- [ ] **Step 2: Write the failing tests**

In `analytics.spec.ts`, using `request(app.getHttpServer()).post(`/public/links/${slug}/views`)`:

- `"stores a view with its source"` — send `{ utmSource: "Telegram", utmMedium: "social" }`, expect `200`
  and `{ ok: true }`, then read the row through the repository and expect `utmSource` `"telegram"` and
  `referrerInternal` `false`.
- `"refuses a view for a draft page"` — `draftPage(app)`, expect `404`, expect `0` rows for that link.
- `"refuses a view body that carries visitor data"` — send `{ utmSource: "x", userAgent: "y" }`,
  expect `400`, and expect no row for that link.
- `"counts a reload against the same visitor"` — 10 posts with one `User-Agent` header, expect 200 ten
  times, the 11th expect `429`, and the stored count `10`.
- `"leaves another visitor's budget alone"` — after the previous case, one post with a different
  `User-Agent` header, expect `200`.
- `"reads the visitor from the forwarded address"` — post with `.set("X-Forwarded-For", "198.51.100.9")`
  and a known `User-Agent`, then expect the stored `visitorHash` to equal
  `visitorHashOf({ ip: "198.51.100.9", userAgent: <that value>, at: <test clock> })`.

Every view test must send its own `User-Agent` header: the window is keyed by the visitor hash, so the
suite's shared address would otherwise spend one visitor's budget across tests. This is the same reason
the click tests each get their own page.

- [ ] **Step 3: Run them and watch them fail**

Run: `pnpm --filter @links/backend test -- analytics`
Expected: FAIL, 404 on `/public/links/:slug/views`.

- [ ] **Step 4: Implement the route**

In `PublicEventsController`:

```ts
@Post("links/:slug/views")
async recordView(@Param("slug") slug: string, @Body() body: RecordPageViewDto, @Req() req: Request) {
  const link = await this.linksService.getPublishedBySlug(slug);
  const visitorHash = visitorHashOf({ ip: req.ip ?? "", userAgent: req.header("user-agent") ?? "", at: new Date() });

  await this.analytics.recordView(link.id, visitorHash, toSourceColumns(body));

  return { ok: true };
}
```

`import type { Request } from "express"` — type-only, per the SWC constraint.

`recordView` admits against its own window (`this.viewWindow.admit(linkId, visitorHash, refusedView)`,
with its own two messages, so a refusal never reuses the click wording) and then saves the row. Doc
comment: a page load is one event, so the per-key limit is a reload guard, and the scope limit is what
keeps a page from multiplying traffic by block count.

- [ ] **Step 5: Run the tests**

Run: `pnpm --filter @links/backend test -- analytics`
Expected: PASS, all view cases.

- [ ] **Step 6: Commit**

```bash
git add apps/backend/src/analytics/analytics.service.ts apps/backend/src/public/public-events.controller.ts apps/backend/src/configure-app.ts apps/backend/test/analytics.spec.ts
git commit -m "feat(backend): record page views behind their own rate window"
```

---

### Task 6: Clicks carry the same source

**Files:**

- Modify: `apps/backend/src/analytics/block-event.entity.ts` (nullable `visitorHash`, five source columns)
- Create: `apps/backend/src/migrations/<timestamp>-AddBlockEventSource.ts`
- Modify: `apps/backend/src/analytics/analytics.service.ts` (`record` signature)
- Modify: `apps/backend/src/public/public-events.controller.ts`
- Test: `apps/backend/test/analytics.spec.ts` (extend)

**Interfaces:**

- Consumes: `SourceColumns`, `toSourceColumns` (Task 4), `visitorHashOf` (Task 3).
- Produces:
  - `BlockEvent` gains `utmSource`, `utmMedium`, `utmCampaign`, `referrerHost` (nullable `varchar`),
    `referrerInternal` (boolean, default `0`), `visitorHash` (**nullable** `varchar`).
  - `AnalyticsService.record(linkId: string, blockId: string, kind: BlockEventKind, visitorHash: string, source: SourceColumns): Promise<void>`.

- [ ] **Step 1: Add the columns and the indexes**

Entity first, then `pnpm migration:generate src/migrations/AddBlockEventSource`, then hand-write the
`ALTER TABLE "block_events" ADD COLUMN …` statements plus the two indexes from Task 2, and a `down()` that
TypeORM's SQLite driver can express (drop the indexes, drop the columns). Class comment: `visitorHash` is
nullable because this table has history — a row written before today counts as a click and as zero
distinct clickers, and no hash is invented for it.

- [ ] **Step 2: Write the failing tests**

- `"stores the source on a click"` — post an event with `{ utmSource: "Telegram" }` and a known
  `X-Forwarded-For`; read the row back and expect `utmSource` `"telegram"` and a `visitorHash` matching
  `visitorHashOf(...)`.
- `"keeps a row written before the source existed"` — insert a `BlockEvent` through the repository with
  only `linkId`, `blockId`, `kind: "click"`; read it back and expect `visitorHash` to be `null`,
  `referrerInternal` `false` and `utmSource` `null`. The aggregation half of the same story (one click,
  zero distinct clickers) is asserted in Task 7.

- [ ] **Step 3: Run them and watch them fail**

Run: `pnpm --filter @links/backend test -- analytics`
Expected: FAIL — the source column is null, the hash absent.

- [ ] **Step 4: Pass the source through**

Controller computes the hash and the columns exactly as in Task 5 and calls
`analytics.record(link.id, body.blockId, body.kind, visitorHash, toSourceColumns(body))`; `record` spreads
them into `this.events.create({ ... })`.

- [ ] **Step 5: Run the tests**

Run: `pnpm --filter @links/backend test -- analytics`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/backend/src/analytics apps/backend/src/migrations apps/backend/src/public/public-events.controller.ts apps/backend/test/analytics.spec.ts
git commit -m "feat(backend): record the traffic source on every click"
```

---

### Task 7: Per-page aggregation

**Files:**

- Create: `apps/backend/src/analytics/stats.ts` (`StatsTotals`, `StatsPoint`, `StatsSource`, `BlockClicks`, `LinkStats`, `classifySource`)
- Modify: `apps/backend/src/analytics/source.ts` (add the host→medium map)
- Modify: `apps/backend/src/analytics/analytics.service.ts` (`linkStats`)
- Modify: `apps/backend/src/links/links.controller.ts` (route now returns the rich shape)
- Test: `apps/backend/test/source.spec.ts` (classify), `apps/backend/test/analytics.spec.ts` (aggregation)

**Interfaces:**

- Consumes: `SourceColumns` (Task 4), both entities (Tasks 2, 6).
- Produces:
  - `classifySource(columns: SourceColumns): { source: string; medium: "search" | "social" | "referral" | "direct" | "internal" }`
  - `interface StatsTotals { views: number; visitors: number; clicks: number }`
  - `interface StatsPoint { date: string; views: number; visitors: number; clicks: number }`
  - `interface StatsSource { source: string; medium: string; views: number; visitors: number; clicks: number }`
  - `interface BlockClicks { blockId: string; clicks: number; visitors: number }`
  - `interface LinkStats { totals: StatsTotals; timeseries: StatsPoint[]; sources: StatsSource[]; blocks: BlockClicks[] }`
  - `AnalyticsService.linkStats(linkId: string, range: StatsQueryDto): Promise<LinkStats>`

- [ ] **Step 1: Write the failing classification tests**

In `source.spec.ts`:

- `"prefers utm over the referrer"` — `{ utmSource: "tg", utmMedium: "social", referrerHost: "google.com" }` → `{ source: "tg", medium: "social" }`.
- `"falls back to the referring host"` — `{ referrerHost: "google.com" }` → `{ source: "google.com", medium: "search" }`.
- `"calls an internal navigation internal, not direct"` — `{ referrerInternal: true }` → `{ source: "internal", medium: "internal" }`.
- `"calls a visit with nothing direct"` — `{}` → `{ source: "direct", medium: "direct" }`.
- `"classifies an unlisted host as referral"` — `{ referrerHost: "news.example.org" }` → medium `"referral"`.
- `"classifies t.me as social and yandex.ru as search"`.

- [ ] **Step 2: Run them and watch them fail**

Run: `pnpm --filter @links/backend test -- source.spec`
Expected: FAIL — `classifySource` is not exported.

- [ ] **Step 3: Implement classification**

`source.ts` gains two `Set`s of hosts (search: `google.`, `bing.com`, `duckduckgo.com`, `yandex.ru`,
`ya.ru`, `search.yahoo.com`; social: `t.me`, `telegram.me`, `x.com`, `twitter.com`, `vk.com`,
`facebook.com`, `instagram.com`, `linkedin.com`, `reddit.com`, `pinterest.com`, `tiktok.com`,
`youtube.com`) matched by exact host or by suffix for `google.`, and `classifySource` in `stats.ts`
applying the precedence utm → host → internal → direct. Doc comment: classification happens on read, so
the list can grow and history re-classifies itself.

- [ ] **Step 4: Write the failing aggregation tests**

In `analytics.spec.ts`, `"aggregates a page's traffic"`:

- Publish a page; post two views with different `User-Agent`s and `utmSource=telegram`, one view with no
  source, and two clicks on `b1` (one of them the same UA as a view); read `GET /links/:id/stats`.
- Expect `totals` to be `{ views: 3, visitors: 3, clicks: 2 }`, `sources` to contain
  `{ source: "telegram", medium: "social", views: 2, visitors: 2, clicks: 0 }` and
  `{ source: "direct", medium: "direct", views: 1, visitors: 1, clicks: 0 }`, `blocks` to equal
  `[{ blockId: "b1", clicks: 2, visitors: 2 }]`, and `timeseries` to be one point for today with those
  sums.
- `"counts the same visitor once"` — two views with identical UA and forwarded address → `visitors: 1`,
  `views: 2`.
- `"answers zeros for a page with no traffic"` — `totals` all `0`, `timeseries`, `sources`, `blocks`
  empty arrays, status `200`.
- `"respects the range"` — the existing `from`/`to` cases keep passing on the new shape.

- [ ] **Step 5: Run them and watch them fail**

Run: `pnpm --filter @links/backend test -- analytics`
Expected: FAIL — `totals` is undefined.

- [ ] **Step 6: Implement `linkStats`**

Five queries, all filtered by `linkId` and the optional `datetime(...) >= datetime(:from)` /
`<= datetime(:to)` pair:

1. views totals — `COUNT(*)` and `COUNT(DISTINCT visitorHash)` from `page_views`;
2. click totals — `COUNT(*)` from `block_events` where `kind = 'click'`;
3. timeseries — `date(createdAt)` grouped over `page_views`, and separately over `block_events`, merged
   in JS by date (sparse: no row for a day without events);
4. sources — group by the five raw source columns on both tables, `classifySource` each group, merge the
   two sets by `source|medium`;
5. blocks — `blockId` grouped over `block_events` where `kind = 'click'`, `COUNT(DISTINCT visitorHash)`
   for `visitors`.

`LinksController.stats` keeps its route and ownership check and returns
`await this.analytics.linkStats(link.id, query)` directly — the response is now the `LinkStats` object
itself, not `{ blocks }`.

- [ ] **Step 7: Run the tests**

Run: `pnpm --filter @links/backend test`
Expected: PASS. The existing block-stats assertions (`{ blockId: "b1", clicks: 1, views: 0 }`) are updated
to the new shape as part of this task.

- [ ] **Step 8: Commit**

```bash
git add apps/backend/src/analytics apps/backend/src/links/links.controller.ts apps/backend/test
git commit -m "feat(backend): aggregate views, visitors, sources and clicks per page"
```

---

### Task 8: Overview across the owner's pages, and the read routes' new home

**Files:**

- Create: `apps/backend/src/analytics/analytics.controller.ts`
- Modify: `apps/backend/src/analytics/stats.ts` (`OverviewStats`, `OverviewLinkRow`)
- Modify: `apps/backend/src/analytics/analytics.service.ts` (`overview`)
- Modify: `apps/backend/src/analytics/analytics.module.ts` (export what the controller needs)
- Modify: `apps/backend/src/links/links.module.ts` (register `AnalyticsController`)
- Modify: `apps/backend/src/links/links.controller.ts` (remove `stats`)
- Test: `apps/backend/test/analytics.spec.ts` (extend)

**Interfaces:**

- Consumes: `linkStats` internals (Task 7), `LinksService.getOwned` / `.list`, `AuthGuard`.
- Produces:
  - `interface OverviewLinkRow { id: string; slug: string; title: string; views: number; visitors: number; clicks: number }`
  - `interface OverviewStats { totals: StatsTotals; timeseries: StatsPoint[]; sources: StatsSource[]; links: OverviewLinkRow[] }`
  - `AnalyticsService.overview(links: { id: string; slug: string; title: string }[], range: StatsQueryDto): Promise<OverviewStats>`
  - `GET /analytics/links/:id` and `GET /analytics/overview`, both `@UseGuards(AuthGuard)`.

- [ ] **Step 1: Write the failing tests**

- `"leaves the block counters where they were"` — the Task 7 aggregation answers on
  `GET /analytics/links/:id` now; the old `/links/:id/stats` returns `404`.
- `"lists every owned page, including the quiet ones"` — two pages, traffic on one; expect both rows, the
  quiet one with `{ views: 0, visitors: 0, clicks: 0 }`.
- `"sums the owner's pages"` — `totals` equal the sum of the rows' totals; `sources` merge across pages.
- `"keeps another user's pages out"` — a stranger's `GET /analytics/overview` answers `200` with only
  their own (empty) list; `GET /analytics/links/:id` for someone else's page answers `404`.
- `"answers 401 without a session"` — both routes, no cookie.

- [ ] **Step 2: Run them and watch them fail**

Run: `pnpm --filter @links/backend test -- analytics`
Expected: FAIL — 404 on `/analytics/overview`.

- [ ] **Step 3: Implement `overview`**

Start from the caller's links (zeros for a page with no rows), then run the same five grouped queries as
`linkStats` with `linkId IN (:...ids)`, grouping by `linkId` first. If the caller owns nothing, return the
empty shape without querying — an `IN ()` list is not valid SQL.

- [ ] **Step 4: Write the controller and move the routes**

`AnalyticsController` with `@Controller("analytics")`, ownership first via `linksService.getOwned`, and
the two routes. Register it in **`LinksModule.controllers`**, next to `LinksController`: `LinksModule`
already imports `AnalyticsModule`, and declaring it in `AnalyticsModule` would make the two modules import
each other. Delete `stats` from `LinksController`.

- [ ] **Step 5: Run the tests**

Run: `pnpm --filter @links/backend test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/backend/src/analytics apps/backend/src/links apps/backend/test/analytics.spec.ts
git commit -m "feat(backend): add an overview across the owner's pages"
```

---

### Task 9: Docs and the Bruno collection

**Files:**

- Modify: `docs/conventions.md`
- Create: `apps/backend/.bruno/public/views.bru` (folder per the collection's existing layout)
- Create: `apps/backend/.bruno/analytics/overview.bru`

**Interfaces:** none — this task ships no runtime code.

- [ ] **Step 1: Document the environment and the tables**

In the env table add `ANALYTICS_SALT` — read in `analytics/visitor-hash.ts`, optional, falling back to
`JWT_SECRET`. In the backend section add: the backend expects exactly one trusted proxy hop
(`trust proxy` in `configure-app.ts`); `page_views` and `block_events` grow without a retention job, and
a decision on pruning is still open; uniques are per UTC day, so a range's visitor count is a sum of
daily uniques.

- [ ] **Step 2: Add the Bruno requests**

`POST /public/links/:slug/views` with a json body carrying `utmSource`/`utmMedium`, asserting `200`; and
`GET /analytics/overview` against an authenticated folder, asserting `200` and that `links` is an array.

- [ ] **Step 3: Run them**

Run: `npx @usebruno/cli run apps/backend/.bruno --env <the collection's own environment name>` from the
repo root, with the backend running (`pnpm --filter @links/backend dev`).
Expected: all requests green, including the pre-existing ones.

- [ ] **Step 4: Commit**

```bash
git add docs/conventions.md apps/backend/.bruno
git commit -m "docs(backend): document analytics env, tables and requests"
```

---

### Task 10: Read the source on the client and report a view

**Files:**

- Modify: `apps/web/src/shared/blocks/analytics.ts`
- Test: `apps/web/src/shared/blocks/analytics.test.ts` (extend)

**Interfaces:**

- Consumes: nothing beyond `navigator.sendBeacon`.
- Produces:
  - `interface EventSource { utmSource?: string; utmMedium?: string; utmCampaign?: string; referrerHost?: string; referrerInternal?: boolean }`
  - `readSource(): EventSource`
  - `trackPageView(input: { slug: string; origin: string }): void`
  - `trackBlockEvent` keeps its signature and now sends the same source fields.

- [ ] **Step 1: Write the failing tests**

In the existing `analytics.test.ts` (happy-dom):

- `"prefers utm tags from the address"` — set `location.search` via
  `history.replaceState({}, "", "/p?utm_source=Telegram&utm_medium=social")`, expect
  `readSource()` to be `{ utmSource: "telegram", utmMedium: "social" }`.
- `"reads an external referrer as a host"` — `Object.defineProperty(document, "referrer", { value: "https://www.google.com/search?q=x", configurable: true })`, expect `{ referrerHost: "google.com" }`.
- `"marks our own origin as internal"` — `document.referrer` equal to `location.origin + "/other"`, expect
  `{ referrerInternal: true }` and no `referrerHost`.
- `"treats an unparseable referrer as absent"` — `document.referrer` = `"not a url"`, expect `{}`.
- `"sends a view to the views endpoint"` — `trackPageView({ slug: "my-page", origin: "http://api" })`,
  expect the `sendBeacon` mock to be called with `http://api/public/links/my-page/views`.
- `"swallows a transport that throws"` — `sendBeacon` throws, expect no exception and no `throw`.

- [ ] **Step 2: Run them and watch them fail**

Run: `pnpm --filter @links/web test -- analytics`
Expected: FAIL — `readSource` is not exported.

- [ ] **Step 3: Implement**

`readSource()` derives the body from `location.search` and `document.referrer` on each call (no module
cache: within one document neither changes, and a cache would be state that outlives a test). Send it
through one private `beacon(path, body)` used by both trackers, which keeps the never-throw contract in
one place. Lowercase utm values client-side too — the server normalises as well, and both being right is
cheaper than one being wrong.

- [ ] **Step 4: Run the tests**

Run: `pnpm --filter @links/web test -- analytics`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/shared/blocks/analytics.ts apps/web/src/shared/blocks/analytics.test.ts
git commit -m "feat(web): report a page view with its traffic source"
```

---

### Task 11: The public page reports its own visit

**Files:**

- Modify: `apps/web/src/features/links/ui/link-page-renderer/link-page-renderer.vue`
- Test: `apps/web/src/features/links/ui/link-page-renderer/link-page-renderer.test.ts` (extend)

**Interfaces:**

- Consumes: `trackPageView` (Task 10).
- Produces: nothing new; the renderer gains one `onMounted` call.

- [ ] **Step 1: Write the failing test**

Add a `describe("LinkPageRenderer page views")` block that mocks `~shared/blocks`'s `trackPageView` with
`vi.mock` (the file already mocks `~shared/blocks/use-blocks-resolver`):

- `"reports one view when the page is served"` — mount with `props: { blocks: [], now, slug: "my-page" }`,
  expect `trackPageView` called once with `{ slug: "my-page", origin: <runtime config value> }`.
- `"reports nothing without a slug"` — mount without `slug` (the preview case), expect no call.

- [ ] **Step 2: Run it and watch it fail**

Run: `pnpm --filter @links/web test -- link-page-renderer`
Expected: FAIL — `trackPageView` never called.

- [ ] **Step 3: Implement**

`onMounted(() => { if (props.slug) trackPageView({ slug: props.slug, origin: config.public.backendUrl }); })`
with the comment the spec asks for: `onMounted` is client-only, so SSR never reports a request the
visitor's browser has not run, and the `slug` guard is what keeps the owner's preview out of the numbers.

- [ ] **Step 4: Run the tests**

Run: `pnpm --filter @links/web test -- link-page-renderer`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/links/ui/link-page-renderer
git commit -m "feat(web): count a page view when the public page mounts"
```

---

### Task 12: The analytics API client and its types

**Files:**

- Create: `apps/web/src/shared/api/backend/analytics/get-link-stats.ts`, `get-overview.ts`, `index.ts`
- Delete: `apps/web/src/shared/api/backend/links/get-link-stats.ts` (and its line in `links/index.ts`)
- Modify: `apps/web/src/shared/api/backend/types.ts`, `apps/web/src/shared/api/backend/index.ts`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/block-stats/block-stats.vue` and its test

**Interfaces:**

- Consumes: `GET /analytics/links/:id`, `GET /analytics/overview` (Task 8).
- Produces:
  - `type StatsRange = { from?: string; to?: string }`
  - `interface StatsTotals`, `StatsPoint`, `StatsSource`, `BlockStats { blockId; clicks; visitors }`, `LinkStats`, `OverviewLinkRow`, `OverviewStats` — mirroring the backend's `stats.ts`.
  - `AnalyticsApi.getLinkStats(id: string, range?: StatsRange): Promise<{ stats: LinkStats | null; failed: boolean }>`
  - `AnalyticsApi.getOverview(range?: StatsRange): Promise<{ stats: OverviewStats | null; failed: boolean }>`
  - `AnalyticsApi` exported from `~shared/api/backend`.

- [ ] **Step 1: Write the failing test**

`block-stats.test.ts` currently mocks `LinksApi.getLinkStats`. Rewrite it against
`AnalyticsApi.getLinkStats` returning `{ stats: { blocks: [...] }, failed: false }`:

- `"shows the clicks the page collected for the selected block"` — same assertion as today, on
  `stats.blocks`.
- `"shows zeros for a block no event was recorded for"`.
- `"shows zeros when the request failed"` — `{ stats: null, failed: true }` still reads `0`, because this
  panel is a counter beside an editor, not a dashboard; the screens get the failure state, the panel does
  not.

- [ ] **Step 2: Run it and watch it fail**

Run: `pnpm --filter @links/web test -- block-stats`
Expected: FAIL — `AnalyticsApi` has no `getLinkStats`.

- [ ] **Step 3: Implement the client**

Two functions following `get-link-submissions.ts`'s shape: `useApiClient()`, `api<T>(path, { query: range })`,
`try/catch` returning `{ stats: null, failed: true }`. Types go in `types.ts` next to `BlockStats`, which
loses its `views` field. `block-stats.vue` reads `(await AnalyticsApi.getLinkStats(id)).stats?.blocks ?? []`
and drops the comment about views never being reported.

The spec says this function keeps its contract; it keeps it **from the panel's side** — the numbers it
puts on screen are unchanged. Only its return shape widens, because the screens in Task 14 need to tell
"nothing yet" from "could not ask", and one client function serving both is less code than two.

- [ ] **Step 4: Run the tests**

Run: `pnpm --filter @links/web test -- block-stats`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/shared/api apps/web/src/widgets/multilinks-constructor/ui/block-stats
git commit -m "feat(web): read analytics through its own API client"
```

---

### Task 13: The dashboard widget

**Files:**

- Create: `apps/web/src/widgets/stats-dashboard/model/fill-days.ts`, `use-stats-range.ts`, `index.ts`
- Create: `apps/web/src/widgets/stats-dashboard/ui/range-picker.vue`, `totals-cards.vue`, `visits-chart.vue`, `sources-table.vue`, `index.ts`
- Create: `apps/web/src/widgets/stats-dashboard/index.ts`
- Test: `apps/web/src/widgets/stats-dashboard/model/fill-days.test.ts`, `ui/visits-chart.test.ts`, `ui/sources-table.test.ts`

**Interfaces:**

- Consumes: `StatsPoint`, `StatsSource`, `StatsTotals`, `StatsRange` (Task 12), `@links/ui` primitives.
- Produces:
  - `type StatsRangePreset = "7d" | "30d" | "all"`
  - `withEmptyDays(points: StatsPoint[], preset: StatsRangePreset, now: Date): StatsPoint[]` — ascending,
    one point per day in the range, missing days as zeros; `"all"` spans the first to the last point.
  - `useStatsRange(now?: Date): { preset: Ref<StatsRangePreset>; range: ComputedRef<StatsRange> }`
  - `<RangePicker v-model="preset" />`, `<TotalsCards :totals :show-ctr />`,
    `<VisitsChart :points :preset :now />`, `<SourcesTable :sources />` — all exported from `~widgets/stats-dashboard`.

- [ ] **Step 1: Write the failing `fill-days` test**

`"fills the days a sparse series skipped"` — `[{ date: "2026-11-15", … }, { date: "2026-11-17", … }]` with
preset `"7d"` and `now = new Date("2026-11-17T12:00:00Z")` → 7 points, `2026-11-16` with all zeros.
`"keeps every point of a dense series"`, `"returns nothing for an empty series with the all preset"`.

- [ ] **Step 2: Run it and watch it fail**

Run: `pnpm --filter @links/web test -- fill-days`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the model**

`withEmptyDays` builds the day keys from the preset (`7d`/`30d` counted back from `now` in UTC, `all`
from the first point's date), then maps the key range to `points` or a zero point. `useStatsRange` holds
the preset in a `ref` and derives `{ from, to }` ISO strings with `"all"` meaning `{}`.

- [ ] **Step 4: Write the failing component tests**

- `visits-chart.test.ts` — `"draws one bar per day of the range"`: 7 bars rendered for a two-point series
  with the `7d` preset; `"labels the axis in UTC"`: the first bar's `title`/`aria-label` carries the UTC
  date. Assert on rendered elements and attributes, never pixels.
- `sources-table.test.ts` — `"ranks sources by views"` and `"shows the medium label from the API"`, plus
  `"shows nothing but an empty-state line for an empty list"`.

- [ ] **Step 5: Run them and watch them fail**

Run: `pnpm --filter @links/web test -- stats-dashboard`
Expected: FAIL — components not found.

- [ ] **Step 6: Implement the components**

`RangePicker` — three `UIButton`s in a row, `variant="fill"` for the active preset. `TotalsCards` — a `dl`
per metric (`views`, `visitors`, `clicks`, and `ctr = clicks / views` when `show-ctr`, rendered as `—` when
`views` is `0`). `VisitsChart` — inline SVG, one `<rect>` per day scaled to the maximum, `withEmptyDays`
first, a `<title>` per bar with the UTC date and the count; no dependency. `SourcesTable` — a table of
`source`, localised medium, `views`, share of the range's views (never of visitors — a person can have two
sources). All strings through `useI18n()`.

- [ ] **Step 7: Run the tests**

Run: `pnpm --filter @links/web test -- stats-dashboard`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/widgets/stats-dashboard
git commit -m "feat(web): add the stats dashboard widgets"
```

---

### Task 14: The two screens, their routes and their entry points

**Files:**

- Create: `apps/web/src/pages/index/index.ts`, `apps/web/src/pages/index/ui/index-page.vue`
- Create: `apps/web/src/pages/links-stats/index.ts`, `apps/web/src/pages/links-stats/ui/link-stats-page.vue`
- Create: `apps/web/app/pages/links/[id]/stats.vue`
- Modify: `apps/web/app/pages/index/index.vue`
- Modify: `apps/web/src/widgets/multilinks-list/ui/link-actions.vue`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/toolbar/toolbar.vue` and `controls/` (new `stats.vue`)
- Modify: `apps/web/src/shared/locales/en-US.ts`, `ru-RU.ts`
- Test: `apps/web/src/pages/links-stats/ui/link-stats-page.test.ts`, `apps/web/src/pages/index/ui/index-page.test.ts`

**Interfaces:**

- Consumes: `AnalyticsApi` (Task 12), the whole widget (Task 13).
- Produces: the routes `/` and `/links/[id]/stats`; `pages.links.stats.title` and the `stats.*` key set in
  both locales.

- [ ] **Step 1: Add the i18n keys to both locales**

```
pages.links.stats.title   "Page statistics"        | "Статистика страницы"
stats.range.7d            "7 days"                 | "7 дней"
stats.range.30d           "30 days"                | "30 дней"
stats.range.all           "All time"               | "Всё время"
stats.totals.views        "Visits"                 | "Визиты"
stats.totals.visitors     "Visitors (per day)"     | "Посетители (по дням)"
stats.totals.clicks       "Clicks"                 | "Клики"
stats.totals.ctr          "CTR"                    | "CTR"
stats.sources.title       "Sources"                | "Источники"
stats.sources.empty       "No visits in this range" | "За этот период визитов нет"
stats.medium.direct       "direct"                 | "прямой"
stats.medium.internal     "inside the site"        | "внутри сайта"
stats.medium.search       "search"                 | "поиск"
stats.medium.social       "social"                 | "соцсеть"
stats.medium.referral     "referral"               | "переход"
stats.links.title         "Pages"                  | "Страницы"
stats.blocks.title        "Blocks"                 | "Блоки"
stats.failed              "Statistics could not be loaded" | "Статистику не удалось загрузить"
links.actions.stats       "Statistics"             | "Статистика"
```

- [ ] **Step 2: Write the failing page tests**

Both pages mount with `AnalyticsApi` mocked:

- `index-page.test.ts` — `"shows the totals the API returned"`, `"shows the failed state instead of zeros"`,
  `"lists one row per page, with a link to its statistics screen"`.
- `link-stats-page.test.ts` — `"shows the page's totals and its blocks"`, `"shows CTR as a dash when the
  page has no visits"`, `"refetches when the range changes"` (assert the API called twice with different
  `from`).

- [ ] **Step 3: Run them and watch them fail**

Run: `pnpm --filter @links/web test -- stats`
Expected: FAIL — modules not found.

- [ ] **Step 4: Implement the pages and routes**

Both pages: `const { preset, range } = useStatsRange()`, `watch(range, load, { immediate: true })`, render
`RangePicker`, `TotalsCards`, `VisitsChart`, `SourcesTable`, then `links` table (home) or `blocks` table
(per page, block label from the page's own blocks where known, falling back to the id). Home shell becomes
`definePageMeta({ title: "pages.index.title", middleware: "auth" })`; per-page shell is
`app/pages/links/[id]/stats.vue` with `middleware: "auth"` and `params.id` passed down.

- [ ] **Step 5: Wire the entry points**

`link-actions.vue`: a `UIButton` with `i-lucide:chart-no-axes-column` next to Preview, plus the matching
`UIDropdownMenu.Item` in the mobile menu, both `NuxtLinkLocale` to `{ name: "links-id-stats", params: { id } }`.
Toolbar: `controls/stats.vue` — a `UIButton` with a tooltip linking to the same route — added after `Save`.

- [ ] **Step 6: Run the web suite and typecheck**

Run: `pnpm --filter @links/web test`
Expected: PASS (`test` runs `vue-tsc --noEmit` first, so the route names and prop types are checked too).

- [ ] **Step 7: Commit**

```bash
git add apps/web/app apps/web/src apps/web/src/shared/locales
git commit -m "feat(web): add the statistics screens and their entry points"
```

---

### Task 15: End-to-end verification

**Files:** none — this task proves the previous fourteen.

- [ ] **Step 1: Build the libraries web consumes**

Run: `pnpm build`
Expected: green. `@links/ui` and `@links/blocks` build before web, and web's tests load the UI preset
through `uno.config.ts`, so a library change without a rebuild would fail here.

- [ ] **Step 2: Run the gate**

Run: `pnpm verify`
Expected: `lint`, `fmt`, `build` and `test` all green for every package.

- [ ] **Step 3: Exercise the API**

With the backend running, run the Bruno collection (Task 9's requests included). Then, by hand: publish a
page, open `http://localhost:3000/<slug>?utm_source=telegram` in a browser, click a block, and read back
`GET /analytics/overview` — expect one view with `sources[0].source` `"telegram"`, one click, and
`visitors: 1`.

- [ ] **Step 4: Check the screens in the browser**

Report text, not pixels: the home dashboard's visits/visitors/clicks values, the per-page screen's CTR
cell, and the sources table's first row. Confirm the preview page and the constructor do **not** add a
view (reload `/preview/<id>`, then re-read the totals — unchanged).

- [ ] **Step 5: Commit any fix, then report**

```bash
git add -A
git commit -m "test: verify the analytics feature end to end"
```
