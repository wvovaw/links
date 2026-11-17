# List rows: collapsed rows and arrow reordering — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The list editor draws each row as a collapsible header (`Row N` + a summary of the row) and
reorders rows with up/down buttons instead of dragging.

**Architecture:** All of it lands in one existing component,
`apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.vue`, which
every repeating block already goes through. Rows become `reka-ui` accordion items (`type="multiple"`,
so any number of rows may be open) and the component keeps the open set itself, by row position.
`@formkit/drag-and-drop` is deleted from this component only — `page-renderer.vue` still drags blocks.

**Tech Stack:** Vue 3 `<script setup>` + TypeScript, `reka-ui` accordion primitives, `@vue/test-utils`
with `vitest` under `happy-dom`, oxlint/oxfmt.

**Spec:** `docs/superpowers/specs/2026-11-16-list-rows-collapse-reorder-design.md`

## Global Constraints

- Only `apps/web` changes. `packages/blocks` and `packages/ui` are untouched, so no library rebuild is
  needed; if `packages/*/dist` is missing in a fresh clone, run `pnpm build` first — the web tests load
  the UI preset through `uno.config.ts`.
- `@formkit/drag-and-drop` stays in `apps/web/package.json`: `page-renderer.vue` still imports it.
- Editor copy is hardcoded English, aria-labels included (`Move row up`), like the rest of this editor.
- Test ids: keep `list-row`, `list-duplicate`, `list-remove`, `list-add`; add `list-row-toggle`,
  `list-row-summary`, `list-row-required`, `list-move-up`, `list-move-down`.
- `lint` and `fmt` are read-only; when files need formatting use `lint:fix` / `fmt:write`. The gate is
  `pnpm verify`.
- Conventional commits.

## Review Focus

1. **A row value that is not a string** — a number (`rating` in Testimonials), `null`, or an object
   from an older release. Expected: nothing throws, no `null`/`42`/`[object Object]` caption, and a
   `null` field still counts as blank for the required marker while an object counts as filled.
2. **A property stored without `itemFields`** (a block written by another version). Expected: rows
   still draw with an empty body, no summary, no marker.
3. **Reordering at the `minItems` floor and at `maxItems`** — moving is about position, not count:
   both buttons stay live at `minItems` rows, and at `maxItems` rows where Add is disabled.
4. **An empty list** — no rows: the "No rows yet" line, no accordion chrome, Add enabled, and no
   crash from an empty open set.
5. **Duplicate and remove with rows open** — the open set is positions, so both have to move it:
   a removed row leaves the rows below it open, and a duplicate opens the copy while the row it pushed
   down keeps its state.

---

### Task 1: Rows that collapse, with a summary in the header

**Files:**

- Modify: `apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.vue`
- Test: `apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.test.ts`

**Interfaces:**

- Consumes: `listRows`, `itemFieldsOf`, types `IBlockPropertyList`, `BlockItemField`, `ListRow` from
  `@links/blocks`; `UIButton`, `UIInputLabel`, `UIInputHint` from `@links/ui`; `scalarFields` from
  `./scalars` — all as today.
- Produces (Task 2 uses all of these):
  - `const openRows = ref<string[]>([])` — the open rows, by position, as strings because
    `AccordionItemProps.value` is one; bound to the root with `v-model`.
  - `function remapOpen(transform: (index: number) => number | undefined): void` — rewrites the open
    set through `transform`; `undefined` drops an entry.
  - `function summaryOf(row: ListRow): string`
  - `function blankRequiredOf(row: ListRow): string[]`
  - Row header markup with `data-testid="list-row-toggle"`, `"list-row-summary"`, `"list-row-required"`.

- [ ] **Step 1: Write the failing tests**

In `list-field.test.ts`, extend the imports and the mount helper, then add the tests.

```ts
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";

/** `itemFields` may be absent in a property another version stored, so it is the caller's to set. */
function mountField(value: Record<string, unknown>[], field: IBlockPropertyList = property) {
  const model = ref(value);
  const Host = defineComponent({
    render: () =>
      h(ListField, {
        "field": field,
        "id": "field-0",
        "modelValue": model.value,
        "onUpdate:modelValue": (next: Record<string, unknown>[] | undefined) => {
          model.value = next ?? [];
        },
      }),
  });

  return { wrapper: mount(Host), model };
}

/** Rows mount collapsed, and the fields of a row appear a tick after its header is clicked. */
async function openRows(wrapper: VueWrapper, ...indices: number[]) {
  for (const index of indices) {
    await wrapper.findAll("[data-testid='list-row-toggle']")[index]!.trigger("click");
    await flushPromises();
  }
}

describe("ListField rows", () => {
  it("keeps a row's item fields out of the document until the row is opened", async () => {
    const { wrapper } = mountField([one, two]);

    expect(wrapper.find("#field-0-row-0-title").exists()).toBe(false);

    await openRows(wrapper, 0);

    expect(wrapper.find("#field-0-row-0-title").exists()).toBe(true);
    expect(wrapper.find("#field-0-row-1-title").exists()).toBe(false);
  });

  it("summarises a row with its first filled item field", () => {
    const { wrapper } = mountField([{ title: "", link: "https://a.example" }, one]);

    const summaries = wrapper.findAll("[data-testid='list-row-summary']");
    expect(summaries[0]!.text()).toBe("https://a.example");
    expect(summaries[1]!.text()).toBe("One");
  });

  it("shows an image row by the name of the file it stored", () => {
    const imageField: IBlockPropertyList = {
      ...property,
      itemFields: [{ key: "image", id: 0, type: "image", label: "Image", defaultValue: null }],
    };
    const { wrapper } = mountField([{ image: "images/2026/a1b2.png" }], imageField);

    expect(wrapper.get("[data-testid='list-row-summary']").text()).toBe("a1b2.png");
  });

  /* A value that is not a string is content — nothing is missing — but it is not a caption either. */
  it("shows no summary for a value that is not a string, and marks only the empty field", () => {
    const { wrapper } = mountField([{ title: { nested: true } }, { title: null }]);

    expect(wrapper.find("[data-testid='list-row-summary']").exists()).toBe(false);

    const markers = wrapper.findAll("[data-testid='list-row-required']");
    expect(markers).toHaveLength(1);
    expect(markers[0]!.text()).toContain("Title");
  });

  it("names the required item fields a row has left blank, and drops the marker once they are filled", async () => {
    const { wrapper } = mountField([{ title: "", link: "" }]);

    expect(wrapper.get("[data-testid='list-row-required']").text()).toContain("Title");

    await openRows(wrapper, 0);
    await wrapper.get("#field-0-row-0-title").setValue("Filled");

    expect(wrapper.find("[data-testid='list-row-required']").exists()).toBe(false);
    expect(wrapper.get("[data-testid='list-row-summary']").text()).toBe("Filled");
  });

  it("draws no row chrome for an empty list", () => {
    const { wrapper } = mountField([]);

    expect(wrapper.find("[data-testid='list-row']").exists()).toBe(false);
    expect(wrapper.text()).toContain("No rows yet");
    expect(wrapper.get("[data-testid='list-add']").attributes("disabled")).toBeUndefined();
  });

  it("keeps drawing rows whose property declares no item fields", () => {
    const withoutFields = { ...property, itemFields: undefined } as unknown as IBlockPropertyList;
    const { wrapper } = mountField([one], withoutFields);

    expect(wrapper.findAll("[data-testid='list-row']")).toHaveLength(1);
    expect(wrapper.find("[data-testid='list-row-summary']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='list-row-required']").exists()).toBe(false);
  });

  it("adds a row open and leaves the others as they were", async () => {
    const { wrapper } = mountField([one]);

    await wrapper.get("[data-testid='list-add']").trigger("click");
    await flushPromises();

    expect(wrapper.find("#field-0-row-1-title").exists()).toBe(true);
    expect(wrapper.find("#field-0-row-0-title").exists()).toBe(false);
  });

  it("duplicates a row open, keeping the open row it pushed down open", async () => {
    const { wrapper } = mountField([one, two]);
    await openRows(wrapper, 1);

    await wrapper.findAll("[data-testid='list-duplicate']")[0]!.trigger("click");
    await flushPromises();

    expect(wrapper.find("#field-0-row-1-title").exists()).toBe(true);
    expect(wrapper.find("#field-0-row-2-title").exists()).toBe(true);
    expect(wrapper.find("#field-0-row-0-title").exists()).toBe(false);
  });

  it("keeps an open row open when the row above it is removed", async () => {
    const { wrapper } = mountField([one, two]);
    await openRows(wrapper, 1);

    await wrapper.findAll("[data-testid='list-remove']")[0]!.trigger("click");
    await flushPromises();

    expect(wrapper.findAll("[data-testid='list-row']")).toHaveLength(1);
    expect(wrapper.find("#field-0-row-0-title").exists()).toBe(true);
  });
});
```

Then open a row in the three existing tests that reach into it: before
`wrapper.get("#field-0-row-1-title").setValue("Edited")` in "writes a typed value into the row it was
typed in" and in "keeps that binding straight after a row is duplicated", add
`await openRows(wrapper, 1);`; in "marks the item fields the schema requires", add
`await openRows(wrapper, 0);` before reading the labels (it is no longer an `async`-free test).

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd apps/web && pnpm exec vitest run src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.test.ts`

Expected: FAIL — `[data-testid='list-row-toggle']` and the new ids do not exist yet, and the collapsed
rows still render `#field-0-row-0-title`.

- [ ] **Step 3: Implement the collapse in `list-field.vue`**

Imports: drop nothing yet, add `import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from "reka-ui";`.

Script, next to the existing helpers:

```ts
/** The open rows, by position, as strings: an accordion item's `value` is one. */
const openRows = ref<string[]>([]);

/** Every edit that moves a row moves its open entry with it; `undefined` drops the entry. */
function remapOpen(transform: (index: number) => number | undefined) {
  const next: string[] = [];
  for (const value of openRows.value) {
    const mapped = transform(Number(value));
    if (mapped !== undefined && !next.includes(String(mapped))) next.push(String(mapped));
  }
  openRows.value = next;
}

/** What a collapsed row shows: the first item field that holds something, in the schema's order. */
function summaryOf(row: ListRow): string {
  for (const itemField of itemFields.value) {
    const text = summaryValue(row[itemField.key], itemField);
    if (text) return text;
  }
  return "";
}

/** A stored file's name is what the image field already shows beside its preview; a whole path is not. */
function summaryValue(value: unknown, itemField: BlockItemField): string {
  if (typeof value !== "string" || value.trim() === "") return "";
  const text = value.trim();
  return itemField.type === "image" ? (text.split("/").pop() ?? text) : text;
}

/**
 * The required item fields this row has not filled in. A row missing one is never drawn, and that is
 * worth seeing while the row is collapsed. The check mirrors the private `hasContent` in
 * `packages/blocks/src/list.ts`, which answers the same question for a renderer.
 */
function blankRequiredOf(row: ListRow): string[] {
  return itemFields.value
    .filter((itemField) => itemField.required && !hasContent(row[itemField.key]))
    .map((itemField) => itemField.label);
}

function hasContent(value: unknown): boolean {
  if (typeof value === "string") return value.trim() !== "";
  return value !== undefined && value !== null;
}
```

`addRow` appends the new row's position to the open set after `setRows`. `duplicateRow` shifts the
positions above the insertion (`remapOpen((position) => (position > index ? position + 1 : position))`)
and opens the copy at `index + 1`. `removeRow` drops the removed position and shifts the rest down
(`remapOpen((position) => (position === index ? undefined : position > index ? position - 1 : position))`).
`setRows`, `setRowValue` and `defaultRow` are unchanged.

Template: the rows root becomes a plain `<div class="w-full flex flex-col gap-2">` holding an
`AccordionRoot v-model="openRows" type="multiple"` (the plain wrapper keeps the layout independent of
how reka-ui passes `class` through). Each row is the accordion item, and the card's own padding moves
into the header line and the content:

```vue
<AccordionItem
  v-for="(row, index) of rows"
  :key="index"
  :value="String(index)"
  data-testid="list-row"
  class="border border-beerus rounded-moon-i-sm"
>
  <div class="flex items-center gap-2 p-2">
    <AccordionHeader as="div" class="flex-1 min-w-0">
      <AccordionTrigger
        data-testid="list-row-toggle"
        class="group w-full min-w-0 flex items-center gap-2 text-start cursor-pointer"
      >
        <span class="i-lucide:chevron-down h-4 w-4 shrink-0 text-trunks transition-transform group-data-[state=open]:rotate-180" />
        <span class="shrink-0 text-moon-14 text-trunks">Row {{ index + 1 }}</span>
        <span v-if="summaryOf(row)" data-testid="list-row-summary" class="truncate text-moon-14 text-bulma">
          {{ summaryOf(row) }}
        </span>
        <span v-if="blankRequiredOf(row).length" data-testid="list-row-required" class="shrink-0 text-moon-12 text-chichi">
          Required: {{ blankRequiredOf(row).join(", ") }}
        </span>
      </AccordionTrigger>
    </AccordionHeader>
    <div class="ml-auto flex shrink-0 items-center gap-1">
      <!-- Task 2 puts up and down in front of duplicate. -->
      <UIButton data-testid="list-duplicate" variant="ghost" size="sm" icon="i-lucide:copy" aria-label="Duplicate row" :disabled="rows.length >= maximumItems" @click="duplicateRow(index)" />
      <UIButton data-testid="list-remove" variant="ghost" size="sm" icon="i-lucide:trash-2" aria-label="Remove row" :disabled="rows.length <= minimumItems" @click="removeRow(index)" />
    </div>
  </div>
  <AccordionContent class="flex flex-col gap-2 p-2 pt-0">
    <!-- the existing v-for over itemFields, unchanged -->
  </AccordionContent>
</AccordionItem>
```

The action buttons must stay outside the trigger: a button inside the trigger's `<button>` is invalid
markup and its click would toggle the row. The trigger takes `min-w-0` and the buttons `ml-auto`, or
the trigger grows over them.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd apps/web && pnpm exec vitest run src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.test.ts`

Expected: PASS, every test in the file.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.vue \
        apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.test.ts
git commit -m "feat(web): collapse list rows with a summary in the header"
```

### Task 2: Up and down buttons replace the drag handle

**Files:**

- Modify: `apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.vue`
- Test: `apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.test.ts`

**Interfaces:**

- Consumes: `openRows` and `remapOpen` from Task 1; the header block Task 1 left the buttons in.
- Produces: `function moveRow(index: number, offset: -1 | 1): void`, and the header buttons
  `data-testid="list-move-up"` / `"list-move-down"` (aria-labels `Move row up` / `Move row down`).

- [ ] **Step 1: Write the failing tests**

```ts
describe("ListField row order", () => {
  it("moves a row up past its neighbour", async () => {
    const { wrapper, model } = mountField([one, two]);

    await wrapper.findAll("[data-testid='list-move-up']")[1]!.trigger("click");

    expect(model.value).toEqual([two, one]);
  });

  it("moves a row down past its neighbour", async () => {
    const { wrapper, model } = mountField([one, two]);

    await wrapper.findAll("[data-testid='list-move-down']")[0]!.trigger("click");

    expect(model.value).toEqual([two, one]);
  });

  it("stops at the ends", () => {
    const { wrapper } = mountField([one, two]);

    expect(wrapper.findAll("[data-testid='list-move-up']")[0]!.attributes("disabled")).toBeDefined();
    expect(wrapper.findAll("[data-testid='list-move-down']")[1]!.attributes("disabled")).toBeDefined();
  });

  /* Moving is about position, not count, so the floor and the ceiling do not touch it. */
  it("moves rows at minItems and at maxItems alike", async () => {
    const smallest = mountField([one]);
    await smallest.wrapper.findAll("[data-testid='list-move-down']")[0]!.trigger("click");
    expect(smallest.model.value).toEqual([one]);

    const largest = mountField([one, two, three]);
    expect(largest.wrapper.get("[data-testid='list-add']").attributes("disabled")).toBeDefined();
    await largest.wrapper.findAll("[data-testid='list-move-up']")[2]!.trigger("click");
    expect(largest.model.value).toEqual([one, three, two]);
  });

  it("keeps a moved row open and the row it passed as it was", async () => {
    const { wrapper } = mountField([one, two]);
    await openRows(wrapper, 1);

    await wrapper.findAll("[data-testid='list-move-up']")[1]!.trigger("click");
    await flushPromises();

    expect(wrapper.find("#field-0-row-0-title").exists()).toBe(true);
    expect(wrapper.find("#field-0-row-1-title").exists()).toBe(false);
  });

  it("draws no drag handle", () => {
    const { wrapper } = mountField([one]);

    expect(wrapper.find("[data-testid='list-drag']").exists()).toBe(false);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd apps/web && pnpm exec vitest run src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.test.ts`

Expected: FAIL — no `list-move-up` / `list-move-down` and still a `list-drag`.

- [ ] **Step 3: Implement the reorder and delete the drag wiring**

```ts
/** The moved row keeps its open state: the two positions swap their entries. */
function moveRow(index: number, offset: -1 | 1) {
  const target = index + offset;
  if (target < 0 || target >= rows.value.length) return;

  const next = [...rows.value];
  [next[index], next[target]] = [next[target]!, next[index]!];
  setRows(next);
  remapOpen((position) => (position === index ? target : position === target ? index : position));
}
```

In the template, add the two buttons as the first children of the row's button group:

```vue
<UIButton
  data-testid="list-move-up"
  variant="ghost"
  size="sm"
  icon="i-lucide:arrow-up"
  aria-label="Move row up"
  :disabled="index === 0"
  @click="moveRow(index, -1)"
/>
<UIButton
  data-testid="list-move-down"
  variant="ghost"
  size="sm"
  icon="i-lucide:arrow-down"
  aria-label="Move row down"
  :disabled="index === rows.length - 1"
  @click="moveRow(index, 1)"
/>
```

Then remove the drag machinery entirely: the `import { animations, dragAndDrop, tearDown } from
"@formkit/drag-and-drop";` line, the `rowsRoot` ref and its template binding, `onMounted`, and
`onBeforeUnmount`, together with the `grip-vertical` span and its `data-testid="list-drag"`. Nothing
else in `apps/web` loses dragging: `page-renderer.vue` keeps its own wiring and the dependency.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd apps/web && pnpm exec vitest run src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.test.ts`

Expected: PASS, every test in the file.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.vue \
        apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.test.ts
git commit -m "feat(web): reorder list rows with up and down buttons"
```

### Task 3: Verification (the session that holds the browser tools, not an `implementer`)

`implementer` has no browser tooling, and none of the roster's agents has any, so this task belongs to
the orchestrating session.

**Files:** none.

- [ ] **Step 1: Run the gate**

Run: `pnpm verify` (from the repo root)

Expected: lint, fmt, build and test all pass — the build covers the libraries web's tests import.

- [ ] **Step 2: Exercise the constructor in a browser**

Run: `pnpm dev`, then drive the constructor with the `playwright-cli` skill (its own subagent, run
output read as text — never a screenshot into this session). In a page holding a FAQ block and a
Gallery block, read back and report:

- with every row collapsed, the number of elements matching `[data-testid='list-row']` and that no
  `[id$="-title"]` inside them exists;
- the header text of row 1 after filling its question — `Row 1` plus that text, and no `Required:`;
- after clicking `O:…` on row 2, which row's fields are in the document;
- after clicking `Move row down` on row 1, the order of the header texts, and that the public page (or
  the page preview) draws the FAQ entries in the new order;
- that dragging a _block_ in the same panel still works.

Expected: the collapsed list draws no inputs, the open row does, the order changes by one step per
click and the published page follows it, and block dragging is unaffected.

- [ ] **Step 3: Report**

Summarise: the gate's result, the five observations above, and anything the spec's Review Focus list
predicted that did not hold. No commit — the two task commits are the work.
