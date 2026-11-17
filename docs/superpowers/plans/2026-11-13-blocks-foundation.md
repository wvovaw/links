# Blocks Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the block catalog safe to grow: a palette that survives twenty blocks, one typed page theme instead of client CSS, schema tests that catch a bad migration, and four existing blocks that actually work.

**Architecture:** `@links/blocks` gains metadata beside its name union and a `theme.ts` module holding the page-theme model and preset ids — the schema package is the only thing both the NestJS API and the Nuxt app already import, so the model and the validator live there and are consumed, not duplicated. The API stores the theme as a nullable `simple-json` column and validates it through `class-validator`; the web renders it as CSS custom properties with the legacy CSS string still honoured. `@links/blocks` also gains a vitest harness that every later block change runs against.

**Tech Stack:** `@links/blocks` (tsdown, vitest), NestJS + TypeORM over better-sqlite3, Nuxt/Vue 3 with Pinia and UnoCSS (`@links/ui` preset), vitest + happy-dom for web, vitest + supertest for the API.

**Spec:** [`../specs/2026-11-13-block-catalog-design.md`](../specs/2026-11-13-block-catalog-design.md)

## Global Constraints

- The page renders in one column: `.link__container` in `apps/web/src/shared/blocks/theme.css` keeps its stacked 640px layout. No grid or container blocks in this plan.
- A block schema change means: bump `BLOCK_VERSION`, add a step to `migrateBlock`, handle it in the component — `packages/blocks/README.md`.
- A new block means: schema in `packages/blocks/src/blocks/<name>.ts`, component in `apps/web/src/shared/blocks/components/<kebab>-block.vue`, name added to `BLOCK_NAMES` and `registry.ts`.
- `apps/web` consumes `@links/ui` and `@links/blocks` from built `dist`. Rebuild (`pnpm build`, or the single package) before running or trusting anything that imports them, web tests included.
- Backend schema changes go through TypeORM migrations in `apps/backend/src/migrations/`; `synchronize` is off.
- `lint` and `fmt` are read-only; `lint:fix` and `fmt:write` are the writing variants.
- No version numbers in documentation. Conventional commits, one commit per task.
- Node/pnpm versions: `.nvmrc`, `package.json#packageManager`. Never restate them.

## Review Focus

- A page published before this plan has `background` holding raw CSS and `theme` null. It must render byte-identical; T3 pins the legacy branch in `page-theme.test.ts` and the browser check proves the published page.
- A stored block written by an older release carries properties and versions the current schema does not mention. Migrating must preserve them; T4 pins idempotency and extra-key preservation.
- A theme with an unknown preset id (client older or newer than the server) must not blank the page; T3 pins the fallback.
- A palette icon missing from the UnoCSS safelist renders as an empty box with no error anywhere; T1 pins every metadata icon into an explicit list and asserts it.
- Two properties sharing an `id` inside one block break the editor's DOM ids only — nothing throws; T4 asserts id uniqueness for every registered block.

---

### Task 1: Palette metadata and a searchable, grouped Add-Block sheet

**Files:**

- Modify: `packages/blocks/src/types.ts`
- Modify: `packages/blocks/src/main.ts`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/blocks-list/blocks-list.vue`
- Modify: `apps/web/src/shared/locales/en-US.ts`, `apps/web/src/shared/locales/ru-RU.ts`
- Test: `apps/web/src/widgets/multilinks-constructor/ui/blocks-list/blocks-list.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces, in `packages/blocks/src/types.ts`:
  - `export const BLOCK_CATEGORIES = ["Content", "Media", "Links", "Social", "Commerce", "Layout"] as const;`
  - `export type BlockCategory = (typeof BLOCK_CATEGORIES)[number];`
  - `export interface BlockMeta { readonly name: BlockName; readonly label: string; readonly description: string; readonly icon: string; readonly category: BlockCategory; readonly keywords: readonly string[]; }`
  - `export const BLOCK_ICONS: readonly string[]` — the curated safelist of icon names used by any metadata.
  - `export const BLOCK_META: Record<BlockName, Omit<BlockMeta, "name">>;` — exhaustive, so a new name without metadata fails to compile.
  - `export const blocksList: readonly BlockMeta[];` — same shape as today, replaced in place.
  - Exported from `packages/blocks/src/main.ts`.

- [ ] **Step 1: Write the failing test**

In `apps/web/src/widgets/multilinks-constructor/ui/blocks-list/blocks-list.test.ts`, add:

```ts
it("filters blocks by the search query", async () => {
  await wrapper.find("[data-testid='blocks-search']").setValue("para");

  const items = wrapper.findAll("[data-testid='blocks-list-item']");
  expect(items).toHaveLength(1);
  expect(items[0]?.text()).toContain("Paragraph");
});

it("groups blocks by category", () => {
  const groups = wrapper.findAll("[data-testid='blocks-group']");
  expect(groups.length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/blocks build && pnpm --filter @links/web test -- blocks-list`
Expected: FAIL — `[data-testid='blocks-search']` not found.

- [ ] **Step 3: Add the metadata model to `packages/blocks/src/types.ts`**

Keep `BLOCK_NAMES` as the source of the union. Add `BLOCK_META` with one entry per name — for the four existing blocks: `Avatar` (Content, `i-lucide:circle-user-round`), `Button` (Links, `i-lucide:link`), `Paragraph` (Content, `i-lucide:align-left`), `Picture` (Media, `i-lucide:image`). Every `icon` value must also appear in `BLOCK_ICONS`. Write `label`, `description` and 2–4 `keywords` per block in English; they are the fallback the i18n layer overrides.

- [ ] **Step 4: Rewrite `blocks-list.vue`**

Add a `UIInput` with `data-testid="blocks-search"` bound to a `query` ref, group the filtered `blocksList` by `category` (`~shared/lib/utils#groupBy` already exists), render one container per category with `data-testid="blocks-group"`, and keep `data-testid="blocks-list-item"` plus `addBlock(block.name)` on `UIMenu.Item`. The label comes from `t('blocks.' + name + '.label')` with the metadata `label` as fallback; the icon from metadata via `UIMenu.Icon`.

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm --filter @links/web test -- blocks-list`
Expected: PASS, including the pre-existing "can add a block on click".

- [ ] **Step 6: Add the i18n keys**

Add `blocks.<Name>.label` and `blocks.<Name>.description` for all four blocks to both `en-US.ts` and `ru-RU.ts`. Switch the app language and confirm the sheet follows it.

- [ ] **Step 7: Verify the icons actually exist in CSS**

Run: `pnpm build && grep -l 'circle-user-round' apps/web/.output/public/_nuxt/*.css | head -1`
Expected: a file name — if there is none, the class is missing from the safelist and the icon will render as an empty box.

- [ ] **Step 8: Commit**

```bash
git add packages/blocks/src apps/web/src/widgets/multilinks-constructor/ui/blocks-list apps/web/src/shared/locales
git commit -m "feat(blocks): give the block palette metadata, categories and search"
```

### Task 2: Page theme model, migration and API

**Files:**

- Create: `packages/blocks/src/theme.ts`
- Modify: `packages/blocks/src/main.ts`
- Create: `apps/backend/src/links/dto/theme.dto.ts`
- Modify: `apps/backend/src/links/dto/link.dto.ts`, `apps/backend/src/links/link.entity.ts`, `apps/backend/src/links/link.dto.ts`, `apps/backend/src/links/links.service.ts`, `apps/backend/src/links/links.controller.ts`
- Create: `apps/backend/src/migrations/<timestamp>-add-link-theme.ts` (generated, then edited)
- Create: `apps/backend/test/authenticate.ts`
- Test: `apps/backend/test/links.theme.spec.ts`

**Interfaces:**

- Consumes: nothing.
- Produces, in `packages/blocks/src/theme.ts` (exported from `main.ts`):
  - `export const BACKGROUND_PRESETS: Readonly<Record<string, string>>` — the 21 gradient ids currently hardcoded in `apps/web/src/widgets/multilinks-constructor/ui/backgrounds-list/backgrounds-list.vue` (`marine`, `sunset`, …, `desert`), each value the CSS declaration string it holds today.
  - `export const BACKGROUND_PRESET_IDS: readonly string[]`
  - `export const FONT_PRESETS = ["dm-sans", "system"] as const; export type FontPreset = (typeof FONT_PRESETS)[number];`
  - `export const BUTTON_VARIANTS = ["solid", "outline", "ghost"] as const;`
  - `export const COLOR_SCHEMES = ["light", "dark"] as const;`
  - `export interface PageTheme { backgroundPreset: string; overlayOpacity: number; accent: string; text: string; fontPreset: FontPreset; radius: number; buttonVariant: (typeof BUTTON_VARIANTS)[number]; colorScheme: (typeof COLOR_SCHEMES)[number]; }`
  - `export const DEFAULT_PAGE_THEME: PageTheme;` — `marine`, `0.35`, `#2563eb`, `#171515`, `dm-sans`, `12`, `solid`, `light`.
- Produces, in the API: `PATCH /links/:id/theme` returning `LinkDto` with `theme`; `LinkDto` and the public DTO expose `theme: PageTheme | null` and keep `background: string` for legacy pages.
- Produces, in `apps/backend/test/authenticate.ts`: `export async function authenticate(app: INestApplication, email?: string): Promise<ReturnType<typeof request.agent>>` — registers, logs in and returns an agent holding the access cookie.

- [ ] **Step 1: Write the failing test**

Create `apps/backend/test/links.theme.spec.ts`:

```ts
describe("link theme", () => {
  it("stores a valid theme and returns it", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/links").send({ slug: "theme-page", title: "A themed page for tests" });
    const id = created.body.id as string;

    const response = await agent.patch(`/links/${id}/theme`).send({ ...DEFAULT_PAGE_THEME, accent: "#112233" });

    expect(response.status).toBe(200);
    expect(response.body.theme).toEqual({ ...DEFAULT_PAGE_THEME, accent: "#112233" });
    expect((await agent.get(`/links/${id}`)).body.theme.accent).toBe("#112233");
  });

  it("rejects a colour that is not a hex value", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/links").send({ slug: "theme-bad-color", title: "A themed page for tests" });
    const response = await agent
      .patch(`/links/${created.body.id}/theme`)
      .send({ ...DEFAULT_PAGE_THEME, accent: "blue" });

    expect(response.status).toBe(400);
  });

  it("rejects an unknown preset and an unknown field", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/links").send({ slug: "theme-bad-preset", title: "A themed page for tests" });
    const url = `/links/${created.body.id}/theme`;

    expect((await agent.patch(url).send({ ...DEFAULT_PAGE_THEME, backgroundPreset: "nope" })).status).toBe(400);
    expect((await agent.patch(url).send({ ...DEFAULT_PAGE_THEME, customCss: "* {}" })).status).toBe(400);
  });

  it("refuses to store a theme through the content endpoint", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/links").send({ slug: "theme-legacy", title: "A themed page for tests" });

    const response = await agent
      .patch(`/links/${created.body.id}/content`)
      .send({ background: "background:url(//example.com/x.png)" });

    expect(response.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/backend test -- test/links.theme.spec.ts`
Expected: FAIL — `DEFAULT_PAGE_THEME` is not exported, `/theme` returns 404.

- [ ] **Step 3: Write `packages/blocks/src/theme.ts` and export it**

Move the preset map out of `backgrounds-list.vue` verbatim (same ids, same CSS strings), add the interface, the enums, `DEFAULT_PAGE_THEME`, and export everything from `src/main.ts`. Run `pnpm --filter @links/blocks build`.

- [ ] **Step 4: Add the nullable column and generate the migration**

In `apps/backend/src/links/link.entity.ts`:

```ts
@Column({ type: "simple-json", nullable: true })
theme!: PageTheme | null;
```

Keep the existing `background` column untouched. Then:

```bash
pnpm --filter @links/backend migration:run
pnpm --filter @links/backend migration:generate src/migrations/AddLinkTheme
pnpm --filter @links/backend migration:run
```

Expected: the generated file adds `theme` to `links`; `migration:run` reports success.

- [ ] **Step 5: Write `apps/backend/src/links/dto/theme.dto.ts`**

`export class UpdateThemeDto` with every `PageTheme` field required and decorated: `@IsIn(BACKGROUND_PRESET_IDS)`, `@IsNumber() @Min(0) @Max(1)`, `@Matches(/^#[0-9a-fA-F]{6}$/)` for `accent` and `text`, `@IsIn(FONT_PRESETS)`, `@IsInt() @Min(0) @Max(40)` for `radius`, `@IsIn(BUTTON_VARIANTS)`, `@IsIn(COLOR_SCHEMES)`. Give the class a `toPageTheme(): PageTheme` method returning a plain object, so the entity never stores the DTO instance.

- [ ] **Step 6: Wire the endpoint and remove client CSS from the content DTO**

`links.controller.ts`: add `@Patch(":id/theme")` guarded by `AuthGuard`, delegating to `linksService.updateTheme(user, id, body)`. `links.service.ts`: `updateTheme(owner, id, body)` calls `getOwned`, sets `link.theme = body.toPageTheme()`, saves. Delete `background` from `UpdateContentDto` and from `updateContent` — the global `forbidNonWhitelisted` pipe then rejects it with 400. `link.dto.ts` and `toPublicLinkDto`: add `theme: link.theme ?? null`.

- [ ] **Step 7: Write the auth helper**

`apps/backend/test/authenticate.ts` as in **Interfaces** — `request.agent(app.getHttpServer())`, `POST /auth/register` with `{ email, username, password }` (unique email per call: `user-${randomUUID()}@example.com`), then `POST /auth/login`; the agent keeps the `access_token` cookie.

- [ ] **Step 8: Run the test to verify it passes**

Run: `pnpm --filter @links/backend test -- test/links.theme.spec.ts`
Expected: PASS, four tests.

- [ ] **Step 9: Commit**

```bash
git add packages/blocks/src apps/backend/src/links apps/backend/src/migrations apps/backend/test
git commit -m "feat(backend): store and validate a typed page theme"
```

### Task 3: Render the theme and edit it in the constructor

**Files:**

- Create: `apps/web/src/shared/blocks/page-theme.ts`
- Create: `apps/web/src/widgets/multilinks-constructor/ui/theme-editor/theme-editor.vue`, `.../index.ts`
- Modify: `apps/web/src/shared/blocks/theme.css`
- Modify: `apps/web/src/features/links/ui/link-page-renderer/link-page-renderer.vue`, `apps/web/src/widgets/multilinks-constructor/ui/workspace/page-renderer.vue`, `apps/web/src/pages/[link]/ui/link-page.vue`
- Modify: `apps/web/src/widgets/multilinks-constructor/model/constructor.store.ts`
- Modify: `apps/web/src/entities/links/model/links.store.ts`, `apps/web/src/shared/api/backend/links/update-link.ts`, `apps/web/src/shared/api/backend/types.ts`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/toolbar/controls/set-background.vue`
- Test: `apps/web/src/shared/blocks/page-theme.test.ts`

**Interfaces:**

- Consumes: `PageTheme`, `BACKGROUND_PRESETS`, `DEFAULT_PAGE_THEME` from `@links/blocks`.
- Produces, in `apps/web/src/shared/blocks/page-theme.ts`:
  - `export function resolvePageStyle(theme: PageTheme | null, legacyBackground: string | null): Record<string, string> | string` — with a theme: an object carrying the preset's `background`/`background-image`, `--links-page-accent`, `--links-page-fg`, `--links-page-radius`, `--links-font`, `--links-page-overlay`, and `data-`-free colour scheme handled by `color-scheme`; without a theme but with a legacy string: that string unchanged; with neither: `DEFAULT_PAGE_THEME`'s object.
- Produces, in the constructor store: `theme: Ref<PageTheme>`, `setTheme(patch: Partial<PageTheme>): void`, and `theme` included in `saveCurrentState()`.
- Produces, in the API client: `updateTheme({ id, theme }: { id: string; theme: PageTheme }): Promise<Link | undefined>`.

- [ ] **Step 1: Write the failing test**

Create `apps/web/src/shared/blocks/page-theme.test.ts`:

```ts
const legacy = "background-image: linear-gradient(to top, #13b7c6, #a3009c);";

it("returns a legacy background string unchanged", () => {
  expect(resolvePageStyle(null, legacy)).toBe(legacy);
});

it("maps a theme to background and token variables", () => {
  const style = resolvePageStyle({ ...DEFAULT_PAGE_THEME, accent: "#112233", radius: 4 }, null) as Record<
    string,
    string
  >;

  expect(style["background-image"]).toBe(BACKGROUND_PRESETS[DEFAULT_PAGE_THEME.backgroundPreset]);
  expect(style["--links-page-accent"]).toBe("#112233");
  expect(style["--links-page-radius"]).toBe("4px");
});

it("falls back instead of throwing on an unknown preset or missing theme", () => {
  const style = resolvePageStyle({ ...DEFAULT_PAGE_THEME, backgroundPreset: "gone" }, null) as Record<string, string>;

  expect(style["background-image"]).toBe(BACKGROUND_PRESETS[DEFAULT_PAGE_THEME.backgroundPreset]);
  expect(resolvePageStyle(null, null)).toMatchObject({ "--links-page-accent": DEFAULT_PAGE_THEME.accent });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm build && pnpm --filter @links/web test -- page-theme`
Expected: FAIL — `resolvePageStyle` not found.

- [ ] **Step 3: Implement `page-theme.ts`**

Normalise the preset id through `BACKGROUND_PRESET_IDS.includes(...)` with `DEFAULT_PAGE_THEME` as the fallback; build the object with `background-image` (strip the `background:` prefix the preset strings carry) and the token variables. Export one function only.

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm --filter @links/web test -- page-theme`
Expected: PASS, three tests.

- [ ] **Step 5: Apply the style in both renderers**

`LinkPageRenderer` takes `theme` and `background` props and binds `:style="resolvePageStyle(theme, background)"` on `.link` instead of `backgroundCss`. `page-renderer.vue` does the same from the store. `pages/[link]/ui/link-page.vue` passes `pageData.value.theme` through instead of building a style itself.

- [ ] **Step 6: Extend `theme.css` with the page tokens**

Add under `:root` defaults for `--links-page-accent`, `--links-page-fg`, `--links-page-radius`, `--links-page-overlay`, `--links-font`, and point existing block defaults at them (`--links-theme-button-bg` keeps its value, `--links-theme-paragraph-fg` becomes `var(--links-page-fg)`), so a themed page restyles the four existing blocks without touching them.

- [ ] **Step 7: Add theme state and the save path**

`constructor.store.ts`: `theme` initialised from `DEFAULT_PAGE_THEME`, set from `data.theme ?? DEFAULT_PAGE_THEME` in `setupStore`, `setTheme` merging a partial, `$reset` restoring the default, and `saveCurrentState` calling `LinksApi.updateTheme` alongside the existing calls. `types.ts` gains `theme: PageTheme | null` on `Link` and `PublicLink`; `update-link.ts` gains `updateTheme` and drops `background` from `IUpdateContentData`.

- [ ] **Step 8: Replace the background picker with a theme editor**

Create `theme-editor.vue` using `UIScrollArea` like `backgrounds-list.vue` did: preset swatches from `BACKGROUND_PRESETS` calling `setTheme({ backgroundPreset: id })`, then `UISlider` for `overlayOpacity` and `radius`, `UIInput type="color"` for `accent` and `text`, `UISelect` for `fontPreset`, `buttonVariant` and `colorScheme`. Point `set-background.vue` at it and delete `backgrounds-list.vue` and its barrel export.

- [ ] **Step 9: Verify in the browser**

Open a published page saved before this plan (raw CSS in `background`, `theme` null) and one saved after, in the constructor and on the public URL. Expected: the old page looks unchanged; the new page follows preset, accent, radius and font without a reload.

- [ ] **Step 10: Commit**

```bash
git add apps/web/src
git commit -m "feat(web): render and edit the typed page theme"
```

### Task 4: A schema test harness for `@links/blocks`

**Files:**

- Create: `packages/blocks/vitest.config.ts`
- Create: `packages/blocks/test/contract.test.ts`
- Create: `packages/blocks/test/fixtures/paragraph-v0.ts`, `packages/blocks/test/fixtures/button-v0.ts`
- Modify: `packages/blocks/package.json` (add `test`, `test:watch`, devDependencies `vitest`)

**Interfaces:**

- Consumes: `registry`, `createBlock`, `migrateBlock`, `checkBlockUpToDate` from `src/`.
- Produces: `pnpm --filter @links/blocks test`, picked up by root `pnpm test`; a contract every later block change is held to.

- [ ] **Step 1: Write the failing contract test**

Create `packages/blocks/test/contract.test.ts`:

```ts
describe.each(Object.values(registry))("$name", (module) => {
  it("creates a block matching its own version and name", () => {
    const block = module.createBlock("b1");
    expect(block.name).toBe(module.name);
    expect(block.version).toBe(module.BLOCK_VERSION);
  });

  it("gives every property a unique id, a type, a label and a default", () => {
    const block = module.createBlock("b1");
    const properties = Object.values(block.properties);
    const ids = properties.map((p) => p.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const property of properties) {
      expect(property.type).toBeTruthy();
      expect(property.label).toBeTruthy();
      expect(property).toHaveProperty("defaultValue");
    }
  });

  it("migrates idempotently and preserves unknown properties", () => {
    const block = module.createBlock("b1");
    block.properties.legacyFlag = {
      id: 99,
      type: "boolean",
      label: "Old",
      defaultValue: false,
      variant: "switch",
    } as never;
    block.version = 0;

    const once = module.migrateBlock(structuredClone(block));
    const twice = module.migrateBlock(structuredClone(once));

    expect(once.version).toBe(module.BLOCK_VERSION);
    expect(twice).toEqual(once);
    expect(once.properties.legacyFlag).toBeDefined();
  });

  it("leaves an up-to-date block alone", () => {
    const block = module.createBlock("b1");
    expect(checkBlockUpToDate(block).upToDate).toBe(true);
  });
});
```

Plus, in the same file, the pinned-histories case:

```ts
it.each([
  ["Paragraph", paragraphV0, 0],
  ["Button", buttonV0, 0],
])("migrates a stored %s block from version %i to the current schema", (name, fixture, version) => {
  const migrated = migrateBlock(structuredClone(fixture));

  expect(fixture.version).toBe(version);
  expect(migrated.version).toBe(getBlockModule(name as BlockName).BLOCK_VERSION);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/blocks test`
Expected: FAIL — the package has no `test` script and no vitest config.

- [ ] **Step 3: Add the runner**

`vitest.config.ts` with `environment: "node"` and `include: ["test/**/*.test.ts"]`. In `package.json` add `"test": "vitest run"`, `"test:watch": "vitest watch"` and `vitest` to `devDependencies`; run `pnpm install`.

- [ ] **Step 4: Write the two historical fixtures**

`paragraph-v0.ts` and `button-v0.ts` recreate the shapes the migrations expect: a Paragraph carrying `inline-padding` with `step: 2` and a `flag` property, a Button without `border` and with `font-size` holding id 4. Take the shapes from the migration steps in `src/blocks/paragraph.ts` and `src/blocks/button.ts`.

- [ ] **Step 5: Run the suite to verify it passes**

Run: `pnpm --filter @links/blocks test`
Expected: PASS for all four blocks plus both fixtures.

- [ ] **Step 6: Prove the suite catches a silent schema change**

Temporarily change a default value in `src/blocks/picture.ts` without bumping `BLOCK_VERSION`, run the suite, confirm the fixture/idempotency cases still pass (defaults are not pinned yet), then add the pinned-schema snapshot:

```ts
it.each(Object.values(registry))("$name has a pinned schema snapshot", (module) => {
  expect(module.createBlock("b1").properties).toMatchSnapshot();
});
```

Re-run: the changed default now FAILS. Revert the change and confirm PASS.

- [ ] **Step 7: Run the root gate for the package**

Run: `pnpm --filter @links/blocks test && pnpm --filter @links/blocks build`
Expected: both exit 0.

- [ ] **Step 8: Commit**

```bash
git add packages/blocks
git commit -m "test(blocks): cover the create and migrate contract of every block"
```

### Task 5: Repair the four existing blocks

**Files:**

- Modify: `packages/blocks/src/blocks/avatar.ts`, `button.ts`, `paragraph.ts`, `picture.ts`
- Modify: `apps/web/src/shared/blocks/components/avatar-block.vue`, `button-block.vue`, `paragraph-block.vue`, `picture-block.vue`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/text-field.vue`
- Test: `packages/blocks/test/contract.test.ts` fixtures for the new versions

**Interfaces:**

- Consumes: the harness from Task 4.
- Produces: `Avatar` v1 (`image` typed `image`, plus `size`, `shape`, `link`), `Button` v2 (`new-tab`), `Picture` v1 (`alt`, `loading`, `object-fit`, `link`, `radius`), `Paragraph` v3 (`align`, `font-size`).

- [ ] **Step 1: Write the failing migration fixtures**

Add `avatar-v0.ts`, `button-v1.ts`, `picture-v0.ts`, `paragraph-v2.ts` reproducing the current stored shapes, and extend the `it.each` history table with them, asserting each migrates to the new `BLOCK_VERSION`. Run: `pnpm --filter @links/blocks test` — expected FAIL, the versions are still the old ones.

- [ ] **Step 2: Bump and migrate `Avatar`**

`image` becomes `type: "image"`; add `size` (number, 40–240, default 100), `shape` (select circle | rounded, default circle), `link` (url, optional). `BLOCK_VERSION` becomes 1; the migration step keeps the stored string as-is and adds the new properties with their defaults.

- [ ] **Step 3: Render `Avatar` through the storage resolver**

`avatar-block.vue` resolves the value with `StorageApi.resolveImageUrl(value, { origin: config.public.backendUrl })` only when the stored value is not an absolute URL (`/^https?:\/\//`), wraps the image in an `<a rel="noopener noreferrer">` when `link` is set, and applies `size`/`shape` through CSS variables.

- [ ] **Step 4: Bump and migrate `Button`, then render `new-tab`**

Add `new-tab` (boolean, default true), bump to version 2 with a migration adding the default. In `button-block.vue` bind `:target="bp.newTab ? '_blank' : undefined"` and `:rel="bp.newTab ? 'noopener noreferrer' : undefined"`.

- [ ] **Step 5: Bump and migrate `Picture`, then render accessibility properties**

Add `alt` (text, default ""), `loading` (select eager | lazy, default lazy), `object-fit` (select cover | contain, default cover), `link` (url, optional), `radius` (number, 0–40, default 10). Bump to version 1 with defaults. In `picture-block.vue` set `:alt`, `:loading`, `object-fit` via CSS and `aspect-ratio: 16/9` as the fallback box so the layout does not jump, and wrap in a link when set.

- [ ] **Step 6: Bump and migrate `Paragraph`, then render alignment and size**

Add `align` (select left | center | right, default center) and `font-size` (select, values `var(--links-theme-paragraph-font-size-sm|md|lg)`, default md); bump to version 3 with defaults. Render both from properties, keeping `text-align: center` as the CSS fallback so unmigrated HTML still looks right.

- [ ] **Step 7: Decide the fate of `maxLength`**

In `text-field.vue` the TODO says lengths are unimplemented. Implement them with `UIInput`'s native `maxlength`/`minlength` attributes on both the input and the textarea, and keep the fields in `IBlockPropertyText`.

- [ ] **Step 8: Run the suites**

Run: `pnpm --filter @links/blocks test && pnpm --filter @links/blocks build && pnpm --filter @links/web test`
Expected: PASS; migration fixtures reach the new versions.

- [ ] **Step 9: Verify in the browser**

Upload an avatar in the constructor and reload the public page; check a Button opens in a new tab with `rel` set; check a Picture has `alt` and does not shift the layout; check Paragraph alignment persists after save.

- [ ] **Step 10: Commit**

```bash
git add packages/blocks apps/web/src/shared/blocks apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor
git commit -m "fix(blocks): repair avatar uploads, link targets and picture accessibility"
```
