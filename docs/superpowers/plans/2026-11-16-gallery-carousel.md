# Gallery Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the gallery's scroll strip with a themed carousel — one image in the viewport, `‹ ›` arrows, dot pagination — and give the grid a one-column option.

**Architecture:** The block schema moves to version 1: the `strip` option becomes `carousel` (with a migration that rewrites stored values) and `columns` gains `1`. The renderer keeps one `viewport > track > items` markup for every layout and drives the carousel with a clamped index that becomes a CSS `translateX`. Legacy `strip` pages render as the carousel until the constructor migrates them.

**Tech Stack:** TypeScript block schema (`packages/blocks`, tsdown), Vue 3 SFC Composition API (`apps/web`), plain CSS from page theme custom properties, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-16-gallery-carousel-design.md`

## Global Constraints

- A component under `apps/web/src/shared/blocks/components/` never uses `@links/ui`: no kit components, no UnoCSS preset utilities. Controls are plain elements styled from `--links-page-*` and `--links-theme-*` variables.
- `apps/web` consumes `@links/blocks` from `dist`: run `pnpm --filter @links/blocks build` after Task 1 before running any web test.
- Stored block JSON is unvalidated: every value read from `properties` is narrowed or clamped, never trusted.
- Block schema changes follow `packages/blocks/README.md`: change the factory, bump `BLOCK_VERSION`, add a `migrateBlock` step.
- Docs and behaviour ship together: `BLOCK_META.Gallery.description` and both locale descriptions name the carousel.
- Conventional commits. `pnpm verify` is the gate.

## Review Focus

- **A page published with the `strip` layout.** Public pages never run `migrateBlock`, so the renderer must keep drawing a sideways layout for a stored `strip`, not fall back to the grid. Pinned by Task 2's alias test.
- **An old page's stored layout value.** The migration rewrites the `layout` options; taking the whole property object fresh would drop the stored `value`. Pinned by Task 1's strip→carousel and grid-stays-grid tests.
- **Deleting a row while the carousel is on it.** `current` clamps to the remaining rows so the carousel never shows an empty slide. Pinned by Task 2's clamp test.
- **A single-image gallery.** Controls that lead nowhere are noise: no arrows, no dots. Pinned by Task 2's single-image test.
- **One image in the viewport.** The track must be exactly the viewport's width for `-100%` to be one slide, with no gap. Checked in a browser in Task 3.

---

### Task 1: Schema — carousel replaces strip, columns gain 1

**Files:**

- Modify: `packages/blocks/src/blocks/gallery.ts`
- Modify: `packages/blocks/src/types.ts` (`BLOCK_META.Gallery.description`, keywords)
- Test: `packages/blocks/test/contract.test.ts`
- Test data: `packages/blocks/test/fixtures/gallery-v0.ts` (unchanged — it pins the old schema)
- Snapshot: `packages/blocks/test/__snapshots__/contract.test.ts.snap` (regenerated)

**Interfaces:**

- Produces: `getBlockModule("Gallery").BLOCK_VERSION === 1`; `createBlock("Gallery", id)` with `layout.options === [{ label: "Grid", value: "grid" }, { label: "Carousel", value: "carousel" }]` and `columns.options` 1–4; `migrateBlock` rewriting a stored `strip` to `carousel`. Task 2 reads those option values.

- [ ] **Step 1: Write the failing tests**

Append to `packages/blocks/test/contract.test.ts`, after the existing targeted migration tests:

```ts
it("renames a stored strip gallery to the carousel that replaced it", () => {
  const stored = structuredClone(galleryV0);
  (stored.properties.layout as IBlockPropertySelect).value = "strip";
  const original = (stored.properties.items as IBlockPropertyList).value;

  const migrated = migrateBlock(stored);

  expect(migrated.version).toBe(1);
  expect((migrated.properties.layout as IBlockPropertySelect).value).toBe("carousel");
  expect((migrated.properties.items as IBlockPropertyList).value).toEqual(original);
});

it("keeps a stored grid gallery a grid when it migrates", () => {
  const stored = structuredClone(galleryV0);
  (stored.properties.layout as IBlockPropertySelect).value = "grid";

  expect((migrateBlock(stored).properties.layout as IBlockPropertySelect).value).toBe("grid");
});
```

Import `IBlockPropertyList` and `IBlockPropertySelect` as types alongside the existing `BlockName, IBlock` import.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm --filter @links/blocks exec vitest run test/contract.test.ts`
Expected: FAIL — `migrated.version` is 0, the stored value is still `"strip"`, and the schema snapshot differs.

- [ ] **Step 3: Implement the schema change**

In `packages/blocks/src/blocks/gallery.ts`: `BLOCK_VERSION = 1`; `layout.options` becomes Grid/Carousel; `columns.options` becomes 1–4 and its hint names the carousel. Replace the pass-through `migrateBlock` with a version 0 step that mutates the existing `layout` and `columns` property objects in place (keeping any stored `value`), rewrites `value === "strip"` to `"carousel"`, and sets `block.version = 1`. In `packages/blocks/src/types.ts`, rewrite `BLOCK_META.Gallery.description` to name a carousel and keep `carousel` among the keywords.

- [ ] **Step 4: Regenerate the schema snapshot and run the package tests**

Run: `pnpm --filter @links/blocks exec vitest run -u test/contract.test.ts`, then
`pnpm --filter @links/blocks test`
Expected: PASS, including the contract test that compares a migrated v0 gallery's definitions with today's factory.

- [ ] **Step 5: Build the package so `apps/web` sees it**

Run: `pnpm --filter @links/blocks build`
Expected: `dist/` rebuilt with version 1.

- [ ] **Step 6: Commit**

```bash
git add packages/blocks
git commit -m "feat(blocks): turn the gallery strip into a carousel and add a one-column grid"
```

---

### Task 2: Renderer — carousel with themed arrows and dots

**Files:**

- Modify: `apps/web/src/shared/blocks/components/gallery-block.vue`
- Test: `apps/web/src/shared/blocks/components/block-components.test.ts` (the `GalleryBlock` describe)

**Interfaces:**

- Consumes: the `grid` / `carousel` layout values and the 1–4 column set from Task 1.
- Produces: `.gallery-block--carousel`, `.gallery-block__viewport`, `.gallery-block__track` (whose `style` carries `--gallery-index`), `.gallery-block__item`, `.gallery-block__nav--prev`, `.gallery-block__nav--next`, `.gallery-block__dot` (+ `--current`), and the style variables `--gallery-columns` / `--gallery-columns-narrow`. Task 3 checks the same classes in a browser.

- [ ] **Step 1: Write the failing tests**

Replace the strip test in the `GalleryBlock` describe and add the carousel cases:

```ts
it("becomes a carousel when the layout says so and keeps every image", () => {
  const wrapper = wrapperOf({ ...three, layout: "carousel" });

  expect(wrapper.get(".gallery-block").classes()).toContain("gallery-block--carousel");
  expect(wrapper.get(".gallery-block").classes()).not.toContain("gallery-block--grid");
  expect(wrapper.findAll(".gallery-block__item")).toHaveLength(3);
});

it("draws the carousel for a strip stored by an older page", () => {
  expect(wrapperOf({ ...three, layout: "strip" }).get(".gallery-block").classes()).toContain(
    "gallery-block--carousel",
  );
});

it("starts on the first image with the previous arrow disabled", () => {
  const wrapper = wrapperOf({ ...three, layout: "carousel" });
  const track = wrapper.get(".gallery-block__track");

  expect(track.attributes("style")).toContain("--gallery-index: 0");
  expect(wrapper.get(".gallery-block__nav--prev").attributes("disabled")).toBeDefined();
  expect(wrapper.get(".gallery-block__nav--next").attributes("disabled")).toBeUndefined();
});

it("steps one image at a time with the arrows and stops at the last", async () => {
  const wrapper = wrapperOf({ ...three, layout: "carousel" });
  const next = wrapper.get(".gallery-block__nav--next");

  await next.trigger("click");
  expect(wrapper.get(".gallery-block__track").attributes("style")).toContain("--gallery-index: 1");
  await next.trigger("click");
  expect(wrapper.get(".gallery-block__track").attributes("style")).toContain("--gallery-index: 2");
  expect(wrapper.get(".gallery-block__nav--next").attributes("disabled")).toBeDefined();
});

it("draws a dot per image and jumps to the one clicked", async () => {
  const wrapper = wrapperOf({ ...three, layout: "carousel" });
  const dots = wrapper.findAll(".gallery-block__dot");

  expect(dots).toHaveLength(3);
  expect(dots[0]!.attributes("aria-current")).toBe("true");
  expect(dots[1]!.attributes("aria-current")).toBeUndefined();
  expect(dots.map((dot) => dot.attributes("aria-label"))).toEqual(["Image 1", "Image 2", "Image 3"]);

  await dots[2]!.trigger("click");
  expect(wrapper.get(".gallery-block__track").attributes("style")).toContain("--gallery-index: 2");
  expect(wrapper.findAll(".gallery-block__dot")[2]!.attributes("aria-current")).toBe("true");
  expect(wrapper.get(".gallery-block__nav--prev").attributes("disabled")).toBeUndefined();
});

it("draws no controls for a single image", () => {
  const wrapper = wrapperOf({ items: [{ image: "file-a" }], layout: "carousel" });

  expect(wrapper.find(".gallery-block__nav").exists()).toBe(false);
  expect(wrapper.find(".gallery-block__dot").exists()).toBe(false);
});

/* A row deleted while the constructor shows the last slide must not leave an empty one. */
it("keeps the index inside the remaining rows", async () => {
  const wrapper = wrapperOf({ ...three, layout: "carousel" });
  await wrapper.get(".gallery-block__nav--next").trigger("click");
  await wrapper.get(".gallery-block__nav--next").trigger("click");

  await wrapper.setProps({
    properties: blockOf("Gallery", { items: [three.items[0]], layout: "carousel" }).properties,
  });

  expect(wrapper.get(".gallery-block__track").attributes("style")).toContain("--gallery-index: 0");
});
```

Also change the column-clamp table's `["under the range", "1", 2]` row to `["under the range", "0", 1]`,
and add a test for the narrow column variable:

```ts
it("collapses four grid tracks to two on a narrow screen but keeps one as one", () => {
  expect(styleOf({ ...three, columns: "4" })).toContain("--gallery-columns-narrow: 2");
  expect(styleOf({ ...three, columns: "1" })).toContain("--gallery-columns-narrow: 1");
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm --filter @links/web exec vitest run src/shared/blocks/components/block-components.test.ts`
Expected: FAIL on the carousel classes, the index style, the controls, and the one-column range.

- [ ] **Step 3: Implement the component**

In `gallery-block.vue`: `LAYOUTS = ["grid", "carousel"]` with `strip → carousel` in `layoutOf`;
`columnCount` clamping to `[1, 4]`; emit `--gallery-columns` and `--gallery-columns-narrow`. Replace
the template with one `__viewport`-wrapped `__track` of items for every layout, plus the arrows and
dots rendered only for the carousel with more than one row. Add `index`/`current`/`show` to the
script. Replace the strip CSS with the grid-on-track, carousel-track, arrow and dot rules from the
spec, using the page theme variables for colours, radius and focus.

- [ ] **Step 4: Run the tests and the type check**

Run: `pnpm --filter @links/web exec vitest run src/shared/blocks/components/block-components.test.ts`
then `pnpm --filter @links/web run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/shared/blocks/components/gallery-block.vue apps/web/src/shared/blocks/components/block-components.test.ts
git commit -m "feat(web): draw the gallery carousel with themed arrows and dots"
```

---

### Task 3: Copy, docs and the gate

**Files:**

- Modify: `apps/web/src/shared/locales/en-US.ts`, `apps/web/src/shared/locales/ru-RU.ts`
- Verify: whole repo

**Interfaces:**

- Consumes: everything above.

- [ ] **Step 1: Update the block descriptions**

`blocks.Gallery.description` → a description that names the carousel in both locales, e.g.
"Изображения сеткой или каруселью по одному." Keep the palette search keywords in
`packages/blocks/src/types.ts` carrying `carousel`.

- [ ] **Step 2: Run the locale test**

Run: `pnpm --filter @links/web exec vitest run src/shared/locales/locales.test.ts`
Expected: PASS.

- [ ] **Step 3: Run the full gate**

Run: `pnpm verify`
Expected: lint, format check, build and every test pass.

- [ ] **Step 4: Exercise the page in a browser**

Start `pnpm dev`, open a public page with a gallery in the carousel layout and check, as text
(selectors, computed styles, read values — not screenshots): exactly one image is inside the viewport
box, `›` advances the track by one viewport width, the dots follow, the arrows carry the theme's button
colour and the page radius, and a one-column grid stays one column at 360px wide.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/shared/locales
git commit -m "docs(web): describe the gallery carousel in both locales"
```
