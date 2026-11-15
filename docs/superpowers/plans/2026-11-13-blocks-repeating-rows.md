# Block Catalog, Repeating Rows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the `list` property type and the four blocks that live on it — FAQ, gallery, products and testimonials.

**Architecture:** `list` is a property whose value is an array of row objects, each described by the same scalar property interfaces the schema already has. The editor renders rows with the existing field components, so a row's image field uploads through the same path as a block's. Rendering goes through one pure helper that returns only complete, non-empty rows, which keeps every block component free of defensive code.

**Tech Stack:** `@links/blocks` (tsdown, vitest), Vue 3 with `@formkit/drag-and-drop` (already a dependency) for row reordering, vitest + happy-dom.

**Spec:** [`../specs/2026-11-13-block-catalog-design.md`](../specs/2026-11-13-block-catalog-design.md)

## Global Constraints

- One column: a block may use a grid inside itself, never to escape `.link__container`.
- Selling is a link to someone else's checkout (Stripe Payment Link, Gumroad, Ko-fi, BuyMeACoffee). No cart, order, stock or fee model anywhere.
- Every new block: schema in `packages/blocks/src/blocks/<name>.ts`, component in `apps/web/src/shared/blocks/components/<kebab>-block.vue`, name in `BLOCK_NAMES` and `registry.ts`, metadata in `BLOCK_META`.
- Any change to a `list` item shape bumps that block's `BLOCK_VERSION` and carries a migration fixture in `packages/blocks/test/` — the contract suite from the foundation plan must stay green.
- Outbound links carry `rel="noopener noreferrer"` when they open a new tab.
- `apps/web` consumes `@links/blocks` from `dist`: `pnpm build` before web tests and browser checks.
- `lint`/`fmt` read-only; write with `lint:fix`/`fmt:write`. Conventional commits, one commit per task. No version numbers in docs.

## Review Focus

- A row half-filled by a user (image uploaded, title typed, price left blank) must not paint a half-broken card; T1 pins the row filter and each later task filters before rendering.
- Rows carrying keys the current item schema does not declare — saved by another release, or by a block that shares the type — must survive a read and a write; T1 pins that `completeRows` and `listRows` keep them rather than projecting them away.
- Adding, duplicating and removing rows is the interaction most likely to shift the wrong value into the wrong card; T1 pins it in a component test that never relies on drag-and-drop, and T2 repeats it by hand on the first real list block.
- A long FAQ answer, a 300-character testimonial and a 60-character product title are ordinary inputs, not edge cases; T2–T5 pin one of each against horizontal overflow.
- Deleting rows down to `minItems` and adding up to `maxItems` is a boundary a user hits deliberately; T1 pins both ends and each block's behaviour at zero rows.

---

### Task 1: The `list` property type

**Files:**

- Modify: `packages/blocks/src/types.ts`
- Create: `packages/blocks/src/list.ts`
- Modify: `packages/blocks/src/main.ts`
- Create: `apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.vue`, `.../fields/index.ts`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/block-properties-editor.vue`
- Test: `packages/blocks/test/list.test.ts`, `apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.test.ts`

**Interfaces:**

- Produces, in `packages/blocks/src/types.ts`:
  - `export type BlockItemField = IBlockPropertyText | IBlockPropertyNumber | IBlockPropertyBoolean | IBlockPropertySelect | IBlockPropertyColor | IBlockPropertyUrl | IBlockPropertyImage | IBlockPropertyDate;`
  - `export interface IBlockPropertyList<T = Record<string, unknown>[]> extends IBlockPropertyCommon<T> { type: "list"; itemFields: BlockItemField[]; minItems?: number; maxItems?: number; }`
  - `IBlockPropertyList` added to the `BlockProperty` union and `"list"` to `BlockPropertyType`.
- Produces, in `packages/blocks/src/list.ts`:
  - `export type ListRow = Record<string, unknown>;`
  - `export function listRows(property: IBlockPropertyList | undefined): ListRow[]` — the stored value if it is an array, otherwise `[]`.
  - `export function completeRows(property: IBlockPropertyList | undefined, requiredKeys: readonly string[]): ListRow[]` — rows whose `requiredKeys` are all non-empty after trimming.

- [ ] **Step 1: Write the failing test**

Create `packages/blocks/test/list.test.ts`:

```ts
const property: IBlockPropertyList = {
  id: 0,
  type: "list",
  label: "Rows",
  defaultValue: [],
  itemFields: [
    { id: 0, type: "text", label: "Title", defaultValue: null },
    { id: 1, type: "url", label: "Link", defaultValue: null },
  ],
};

it("returns an empty array for a missing or non-array value", () => {
  expect(listRows({ ...property, value: undefined })).toEqual([]);
  expect(listRows({ ...property, value: "nope" as never })).toEqual([]);
});

it("keeps only rows whose required keys have content", () => {
  const value = [
    { title: "One", link: "https://a.example" },
    { title: "Two", link: "" },
    { title: "   ", link: "https://c.example" },
    {},
  ];

  expect(completeRows({ ...property, value }, ["title", "link"])).toEqual([
    { title: "One", link: "https://a.example" },
  ]);
});

it("does not mutate the stored value", () => {
  const value = [{ title: "One", link: "https://a.example" }];
  completeRows({ ...property, value }, ["title"]);

  expect(value).toEqual([{ title: "One", link: "https://a.example" }]);
});

it("keeps keys the item schema does not declare", () => {
  const value = [{ title: "One", link: "https://a.example", discount: "SAVE10" }];

  expect(completeRows({ ...property, value }, ["title"])).toEqual(value);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/blocks test -- list`
Expected: FAIL — `listRows` is not exported.

- [ ] **Step 3: Implement the type and the helpers**

As in **Interfaces**. `completeRows` builds new objects, never edits the input. Export both from `src/main.ts`.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @links/blocks build && pnpm --filter @links/blocks test -- list`
Expected: PASS, three tests.

- [ ] **Step 5: Write the failing editor test**

Create `fields/list-field.test.ts` mounting `list-field.vue` with a two-field `itemFields` and a `maxItems: 3` / `minItems: 1` property:

```ts
it("adds a row with every default value", async () => {
  await wrapper.find("[data-testid='list-add']").trigger("click");

  expect(wrapper.findAll("[data-testid='list-row']")).toHaveLength(2);
  expect(model.value).toHaveLength(2);
});

it("duplicates the values of the row it was clicked on", async () => {
  await wrapper.findAll("[data-testid='list-duplicate']")[0]!.trigger("click");

  expect(model.value).toEqual([
    { title: "One", link: "https://a.example" },
    { title: "One", link: "https://a.example" },
  ]);
});

it("removes the row it was clicked on, not the last one", async () => {
  await wrapper.findAll("[data-testid='list-remove']")[0]!.trigger("click");

  expect(model.value).toEqual([{ title: "Two", link: "https://b.example" }]);
});

it("blocks adding past maxItems and removing past minItems", async () => {
  expect(wrapper.find("[data-testid='list-add']").attributes("disabled")).toBeDefined();
  expect(wrapper.find("[data-testid='list-remove']").attributes("disabled")).toBeDefined();
});
```

Run, with `@links/blocks` rebuilt first because `apps/web` reads it from `dist`:

```bash
pnpm --filter @links/blocks build && pnpm --filter @links/web typecheck
```

Expected: FAIL — the new property type has no `list` mapping in the field map (and `list-field.vue` does not exist yet). `typecheck` is the guard here because `pnpm --filter @links/web build` strips types and never sees the missing mapping.

- [ ] **Step 6: Write `list-field.vue`**

Props: `field: IBlockPropertyList`, `id: string`; model: `IBlockPropertyList["value"]`. Mark the parts the test looks for: `data-testid="list-row"` on each row, `list-add`, `list-duplicate`, `list-remove` on the buttons. Render one card per row: the row's `itemFields` resolved through the same components object the editor uses (lift `fieldsMap` out of `block-properties-editor.vue` into `fields/index.ts` and import it in both places, so a new property type still fails to compile until a field exists). Controls per row: drag handle (wire `dragAndDrop` from `@formkit/drag-and-drop` on the rows container), duplicate, remove. A footer button adds a row using each item field's `defaultValue`; it is disabled at `maxItems`, and remove is disabled at `minItems`. Empty state: a sentence and the add button.

- [ ] **Step 7: Run the editor test to verify it passes**

Run: `pnpm --filter @links/web test -- list-field`
Expected: PASS, four tests.

- [ ] **Step 8: Register the field and prove the compile-time guard**

Add `list: ListField` to the lifted `fieldsMap`. Then temporarily change a property type name in `types.ts`, rebuild `@links/blocks` (`pnpm --filter @links/blocks build`) and run `pnpm --filter @links/web typecheck` — expected: an error naming the missing mapping in `fieldsMap`. Revert and rebuild `@links/blocks`.

- [ ] **Step 9: Run the whole gate for the two packages**

Run: `pnpm --filter @links/blocks test && pnpm build && pnpm --filter @links/web test`
Expected: all exit 0. `pnpm build` is what puts the new `list` export into `@links/blocks/dist`, and `pnpm --filter @links/web test` runs `vue-tsc` before vitest, so the same compile-time guard holds here. The browser check of the editor belongs to Task 2, which is where the first block with a `list` appears.

- [ ] **Step 10: Commit**

```bash
git add packages/blocks apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor
git commit -m "feat(blocks): add a repeatable list property type"
```

### Task 2: `Faq` block

**Files:**

- Create: `packages/blocks/src/blocks/faq.ts`
- Create: `apps/web/src/shared/blocks/components/faq-block.vue`
- Modify: `packages/blocks/src/types.ts`, `packages/blocks/src/registry.ts`
- Test: `packages/blocks/test/fixtures/faq-v0.ts`, `packages/blocks/test/contract.test.ts`

**Interfaces:**

- Consumes: `IBlockPropertyList`, `completeRows` from Task 1.
- Produces: `Faq` block — `title` (text, optional), `items` (list of `{ question: text required, answer: text multiline required }`, `minItems: 1`, `maxItems: 40`), `allow-multiple` (boolean, default false), `divider-style` (select line | filled | none, default line). `BLOCK_VERSION` 0.

- [ ] **Step 1: Add the schema and its fixture**

Write `faq.ts` as in **Interfaces**, register the name and metadata (`Content`, `i-lucide:circle-help`), and add a `faq-v0.ts` fixture to the contract history table. Run `pnpm --filter @links/blocks test` — expected FAIL until the module exists, then PASS.

- [ ] **Step 2: Write the component**

Render `title` when set, then `completeRows(items, ["question", "answer"])` as native `<details>`/`<summary>` pairs with the answer inside — native disclosure needs no JavaScript and keeps the answer text in the HTML for crawlers. `allow-multiple: false` adds `name` attributes so the browser collapses the others; `divider-style` maps to three CSS treatments.

- [ ] **Step 3: Verify content, behaviour and the row editor**

Build and open the published page: answers are present in `curl` output; three questions open/close correctly; with `allow-multiple` off only one stays open. Then in the constructor: add three questions, reorder them by dragging, duplicate the middle one, delete the last one, save, reload the page and confirm the order and the values survived with no value shifted between rows.

- [ ] **Step 4: Commit**

```bash
git add packages/blocks apps/web/src/shared/blocks/components/faq-block.vue
git commit -m "feat(blocks): add an FAQ accordion block"
```

### Task 3: `Gallery` block

**Files:**

- Create: `packages/blocks/src/blocks/gallery.ts`
- Create: `apps/web/src/shared/blocks/components/gallery-block.vue`
- Modify: `packages/blocks/src/types.ts`, `packages/blocks/src/registry.ts`
- Test: `packages/blocks/test/fixtures/gallery-v0.ts`, `packages/blocks/test/contract.test.ts`

**Interfaces:**

- Consumes: `completeRows`.
- Produces: `Gallery` block — `items` (list of `{ image: image required, alt: text, link: url }`, `minItems: 1`, `maxItems: 30`), `layout` (select grid | strip, default grid), `columns` (select 2 | 3 | 4, default 2), `aspect` (select 1:1 | 4:3 | 16:9, default 1:1), `radius` (number 0–32, default 10). `BLOCK_VERSION` 0.

- [ ] **Step 1: Add the schema and fixture**, register metadata (`Media`, `i-lucide:images`), extend the history table, run `pnpm --filter @links/blocks test`.

- [ ] **Step 2: Write the component**

Rows without an `image` are dropped by `completeRows(items, ["image"])`. `grid` is a CSS grid with `grid-template-columns: repeat(var(--cols), 1fr)`; `strip` is `display: flex` with `overflow-x: auto` and `scroll-snap-type: x mandatory`, each item `scroll-snap-align: start`. Every image gets `loading="lazy"`, `alt` from the row, `aspect-ratio` from the property, `object-fit: cover`, and is wrapped in an anchor with `rel="noopener noreferrer"` when `link` is set.

- [ ] **Step 3: Verify in the browser**

Five images in grid mode at 2 and 3 columns with no horizontal scroll; strip mode swipes on a narrow viewport and scrolls with a trackpad; no layout shift while loading (throttle to slow 3G and watch the box already occupied).

- [ ] **Step 4: Commit**

```bash
git add packages/blocks apps/web/src/shared/blocks/components/gallery-block.vue
git commit -m "feat(blocks): add an image gallery block"
```

### Task 4: `Products` block

**Files:**

- Create: `packages/blocks/src/blocks/products.ts`
- Create: `apps/web/src/shared/blocks/components/products-block.vue`
- Modify: `packages/blocks/src/types.ts`, `packages/blocks/src/registry.ts`
- Test: `packages/blocks/test/fixtures/products-v0.ts`, `packages/blocks/test/contract.test.ts`

**Interfaces:**

- Consumes: `completeRows`.
- Produces: `Products` block — `items` (list of `{ image: image, title: text required, subtitle: text, price: text, url: url required }`, `minItems: 1`, `maxItems: 30`), `layout` (select list | grid, default list), `columns` (select 2 | 3, default 2), `show-price` (boolean, default true), `cta-label` (text, default "Buy"), `disclaimer` (text, optional). `BLOCK_VERSION` 0.

- [ ] **Step 1: Add the schema and fixture**, register metadata (`Commerce`, `i-lucide:shopping-bag`), extend the history table, run `pnpm --filter @links/blocks test`.

- [ ] **Step 2: Write the component**

`completeRows(items, ["title", "url"])`; each card shows the image (when set), title, subtitle, `price` verbatim when `show-price`, and a CTA anchor carrying `cta-label`, `target="_blank"`, `rel="noopener noreferrer"`. A card without `url` is dropped by the filter rather than rendered inert. `disclaimer` renders as small text below the list.

- [ ] **Step 3: Verify in the browser**

Two products, one with an image and one without, one with a Cyrillic title and a long price ("от 1 999 ₽"), a blank-title row left in the data: the blank row must not appear; layout holds in both modes and at 320px width.

- [ ] **Step 4: Commit**

```bash
git add packages/blocks apps/web/src/shared/blocks/components/products-block.vue
git commit -m "feat(blocks): add a products block with external checkout links"
```

### Task 5: `Testimonials` block

**Files:**

- Create: `packages/blocks/src/blocks/testimonials.ts`
- Create: `apps/web/src/shared/blocks/components/testimonials-block.vue`
- Modify: `packages/blocks/src/types.ts`, `packages/blocks/src/registry.ts`
- Test: `packages/blocks/test/fixtures/testimonials-v0.ts`, `packages/blocks/test/contract.test.ts`

**Interfaces:**

- Consumes: `completeRows`.
- Produces: `Testimonials` block — `items` (list of `{ quote: text multiline required, author: text, role: text, avatar: image, rating: number 1–5 }`, `minItems: 1`, `maxItems: 20`), `layout` (select list | grid, default list), `show-rating` (boolean, default false). `BLOCK_VERSION` 0.

- [ ] **Step 1: Add the schema and fixture**, register metadata (`Content`, `i-lucide:quote`), extend the history table, run `pnpm --filter @links/blocks test`.

- [ ] **Step 2: Write the component**

`completeRows(items, ["quote"])`; each item is `<blockquote>` with the quote, then `<cite>` holding the avatar (resolved through `StorageApi.resolveImageUrl`), author and role; the rating renders as five `i-lucide:star` spans, filled up to the value, and only when `show-rating` is on and the row has a rating.

- [ ] **Step 3: Verify in the browser**

Three testimonials, one with a 300-character quote, one without an avatar, one without a rating: no horizontal overflow, `blockquote`/`cite` present in the HTML, avatars resolve.

- [ ] **Step 4: Commit**

```bash
git add packages/blocks apps/web/src/shared/blocks/components/testimonials-block.vue
git commit -m "feat(blocks): add a testimonials block"
```
