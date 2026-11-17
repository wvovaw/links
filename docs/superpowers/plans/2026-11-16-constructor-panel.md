# Constructor Panel And In-place Block Insertion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the constructor's two tabs + two sheets with one panel driven by three toolbar buttons, and let a block be inserted at any gap in the page.

**Architecture:** A `PROPERTY_VIEWS` list (`{ id, icon, label, component }`) drives both the panel and the toolbar; the constructor page holds the active view in a ref and provides a `selectView` through the existing constructor injection key. Insert markers live inside the `PageBlock` wrapper so the drag-and-drop node list is unchanged; the palette sheet moves from the toolbar to the workspace, which records the clicked index and inserts there.

**Tech Stack:** Nuxt 4 + Vue 3 SFC (Composition API), Pinia, `@links/ui` (reka-ui based Sheets/Tooltips/ScrollArea), UnoCSS, Vitest + happy-dom through `@nuxt/test-utils`.

**Spec:** `docs/superpowers/specs/2026-11-16-constructor-panel-design.md`

## Global Constraints

- Constructor strings stay hardcoded English; no new i18n keys.
- No persistence of the active view: no URL, no localStorage.
- No change to the block schema, the theme model, or the backend.
- `@formkit/drag-and-drop` stays as it is: the direct children of `.link__blocks-root` must remain exactly the `PageBlock` wrappers.
- Any icon string reached through data (not literal in a template) must be added to `uno.config.ts#safelist`, or it renders as an empty box.
- `apps/web` tests run with `pnpm --filter @links/web exec vitest run <path-substring>`; the gate for the whole change is `pnpm verify` from the repo root.
- Conventional commits.

## Review Focus

- **Reordering after insertion markers exist.** A marker rendered as a sibling of the blocks becomes a draggable node, so `@formkit/drag-and-drop` would try to reorder it as a block. Expected: the drag root has exactly one child per block and dragging still reorders blocks. Pinned by the children-count assertion in Task 3.
- **Adding a block to a page with no blocks.** There is no gap to click, so an empty page must offer its own control. Expected: the control inserts at index 0. Pinned by Task 3's empty-page test and Task 1's empty-array test.
- **Inserting at the very end.** The last block's bottom marker reports `index === blocks.length`; an off-by-one there silently appends to the wrong place. Pinned by Task 3's last-marker test.
- **Editing the theme of a page with no stored theme** (`theme === null`). Expected: the panel shows the defaults, and the first edit materialises them. Pinned by Task 4's switcher test asserting the default accent renders inside the theme view.
- **The mobile properties sheet with the theme editor inside.** Expected: the sheet scrolls to its last field instead of clipping it. Checked in a browser in Task 5's verification step.

---

### Task 1: Insert a block at an index (store)

**Files:**

- Modify: `apps/web/src/widgets/multilinks-constructor/model/constructor.store.ts:87-91`
- Test: `apps/web/src/widgets/multilinks-constructor/tests/constructor.store.test.ts`

**Interfaces:**

- Consumes: `createBlock(name: BlockName, id: string): IBlock` and `generateBlockId()` from the same file, `selectBlock(id: string): void`.
- Produces: `addBlock(name: BlockName, index?: number): void` — inserts at `index`, appends when it is omitted, and selects the new block. Tasks 2 and 5 call it.

- [ ] **Step 1: Write the failing tests**

Append to `constructor.store.test.ts`:

```ts
describe("testing constructor store insertion", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("inserts a block at the given index and selects it", () => {
    const store = useConstructorStore();
    store.addBlock("Avatar");
    store.addBlock("Button");
    const tailId = store.blocks[1]?.id;

    store.addBlock("Paragraph", 1);

    expect(store.blocks.map((block) => block.name)).toEqual(["Avatar", "Paragraph", "Button"]);
    expect(store.blocks[2]?.id).toBe(tailId);
    expect(store.selectedBlockId).toBe(store.blocks[1]?.id);
  });

  it("appends when no index is given", () => {
    const store = useConstructorStore();
    store.addBlock("Avatar");
    store.addBlock("Button", 1);

    expect(store.blocks.map((block) => block.name)).toEqual(["Avatar", "Button"]);
  });

  it("inserts into an empty page at index zero", () => {
    const store = useConstructorStore();
    store.addBlock("Paragraph", 0);

    expect(store.blocks).toHaveLength(1);
    expect(store.selectedBlockId).toBe(store.blocks[0]?.id);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm --filter @links/web exec vitest run src/widgets/multilinks-constructor/tests/constructor.store.test.ts`
Expected: FAIL — `store.blocks.map(...)` is `["Avatar", "Button", "Paragraph"]` (the third argument is ignored, so it appends).

- [ ] **Step 3: Add the index parameter**

In `constructor.store.ts`, replace the existing `addBlock`:

```ts
function addBlock(name: BlockName, index: number = blocks.value.length) {
  const id = generateBlockId();
  blocks.value.splice(index, 0, createBlock(name, id));
  selectBlock(id);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm --filter @links/web exec vitest run src/widgets/multilinks-constructor/tests/constructor.store.test.ts`
Expected: PASS, including the pre-existing `testing constructor store ordering` and visibility tests.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/widgets/multilinks-constructor/model/constructor.store.ts apps/web/src/widgets/multilinks-constructor/tests/constructor.store.test.ts
git commit -m "feat(web): insert a constructor block at a given index"
```

---

### Task 2: The block palette reports its pick

`BlocksList` currently calls `addBlock` itself, so it cannot be reused by a palette that must insert at a remembered index. It reports the picked name instead; its one caller keeps adding (at the end) until Task 5 replaces it.

**Files:**

- Modify: `apps/web/src/widgets/multilinks-constructor/ui/blocks-list/blocks-list.vue`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/blocks-list/blocks-list.test.ts`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/toolbar/controls/add-block.vue`

**Interfaces:**

- Consumes: `addBlock(name: BlockName, index?: number)` from Task 1.
- Produces: `BlocksList` emits `select` with a `BlockName` payload (`defineEmits<{ select: [name: BlockName] }>`). Task 5 consumes it.

- [ ] **Step 1: Write the failing test**

In `blocks-list.test.ts`, replace the `can add a block on click` test with:

```ts
it("emits the picked block's name and leaves adding to the owner", async () => {
  const store = useConstructorStore();
  const before = store.blocks.length;

  await wrapper.find("[data-testid='blocks-list-item']").trigger("click");

  expect(wrapper.emitted("select")?.[0]).toEqual([blocksList[0]?.name]);
  expect(store.blocks.length).toBe(before);
});
```

Add `blocksList` to the `@links/blocks` import in that file. The existing `emits select when a block is picked` test stays and keeps passing.

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/multilinks-constructor/ui/blocks-list`
Expected: FAIL — `emitted("select")` payload is `[]`, not `["Avatar"]` (or whichever name is first), and `store.blocks.length` is 1.

- [ ] **Step 3: Report the name instead of adding**

In `blocks-list.vue`:

```ts
const emit = defineEmits<{ select: [name: BlockName] }>();
```

drop `const { addBlock } = useConstructorStore();` (and its import), and change the handler:

```ts
function selectBlock(block: BlockMeta) {
  emit("select", block.name);
}
```

- [ ] **Step 4: Keep the toolbar palette working**

In `ui/toolbar/controls/add-block.vue`, the sheet's palette no longer adds on its own, so it adds at the end here:

```vue
<BlocksList
  @select="
    (name) => {
      addBlock(name);
      setShow(false);
    }
  "
/>
```

with `import { useConstructorStore } from "../../../model";` and `const { addBlock } = useConstructorStore();` in its script block. This file is deleted in Task 5.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `pnpm --filter @links/web exec vitest run src/widgets/multilinks-constructor/ui/blocks-list`
Expected: PASS, including the filter, grouping and i18n tests.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/widgets/multilinks-constructor/ui/blocks-list apps/web/src/widgets/multilinks-constructor/ui/toolbar/controls/add-block.vue
git commit -m "refactor(web): let the block palette report its pick"
```

---

### Task 3: Insert markers in the page

**Files:**

- Create: `apps/web/src/widgets/multilinks-constructor/ui/workspace/insert-block-button.vue`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/workspace/page-block.vue`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/workspace/page-renderer.vue`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/workspace/page-block.test.ts`
- Test: `apps/web/src/widgets/multilinks-constructor/tests/insert-block.test.ts`

**Interfaces:**

- Consumes: `blocks` from the store; nothing from Tasks 1-2.
- Produces: `PageBlock` props `{ isSelected: boolean; isHidden: boolean; index: number; isLast: boolean }` and event `insert(index: number)`; `PageRenderer` event `insert(index: number)`. Task 5 listens to `PageRenderer`'s `insert`.

- [ ] **Step 1: Write the failing component tests**

In `page-block.test.ts`, add `index: 0, isLast: false` to the props of both existing mounts, then add:

```ts
describe("PageBlock insertion points", () => {
  const props = { isSelected: false, isHidden: false, index: 2 };

  it("offers one point above the block and a second below the last one", () => {
    const alone = mount(PageBlock, { props: { ...props, isLast: true }, slots: { default: "<p />" } });
    const middle = mount(PageBlock, { props: { ...props, isLast: false }, slots: { default: "<p />" } });

    expect(alone.findAll("[data-testid='insert-block']")).toHaveLength(2);
    expect(middle.findAll("[data-testid='insert-block']")).toHaveLength(1);
  });

  it("reports the index it would insert at, and the end for the last block's lower point", async () => {
    const wrapper = mount(PageBlock, { props: { ...props, isLast: true }, slots: { default: "<p />" } });
    const [above, below] = wrapper.findAll("[data-testid='insert-block']");

    await above!.trigger("click");
    await below!.trigger("click");

    expect(wrapper.emitted("insert")).toEqual([[2], [3]]);
  });
});
```

Create `tests/insert-block.test.ts`:

```ts
import type { Pinia } from "pinia";

import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import { useConstructorStore } from "../model";
import PageRenderer from "../ui/workspace/page-renderer.vue";

describe("constructor page insertion points", () => {
  let pinia: Pinia;
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    const store = useConstructorStore();
    store.addBlock("Avatar");
    store.addBlock("Paragraph");
    wrapper = mount(PageRenderer, { global: { plugins: [pinia] } });
  });

  /* A marker rendered as a sibling would become a drag node: the drag root holds blocks only. */
  it("keeps the drag nodes to the blocks and adds one point per gap", () => {
    expect(wrapper.findAll(".link__blocks-root > *")).toHaveLength(2);
    expect(wrapper.findAll("[data-testid='insert-block']")).toHaveLength(3);
  });

  it("forwards the index of the clicked gap", async () => {
    const gaps = wrapper.findAll("[data-testid='insert-block']");

    await gaps[1]!.trigger("click");
    await gaps[2]!.trigger("click");

    expect(wrapper.emitted("insert")).toEqual([[1], [2]]);
  });

  /* A fresh pinia inside the mount is an empty page, whatever the outer one holds. */
  it("offers the first block on an empty page", async () => {
    const empty = mount(PageRenderer, { global: { plugins: [createPinia()] } });

    await empty.get("[data-testid='empty-page-add-block']").trigger("click");

    expect(empty.emitted("insert")).toEqual([[0]]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm --filter @links/web exec vitest run src/widgets/multilinks-constructor/ui/workspace src/widgets/multilinks-constructor/tests/insert-block.test.ts`
Expected: FAIL — no `[data-testid='insert-block']` and no `[data-testid='empty-page-add-block']` exist.

- [ ] **Step 3: Add the marker component**

Create `ui/workspace/insert-block-button.vue`. Hover-revealed on desktop (`group-hover` from the block wrapper), always visible below `md` where there is no hover; `focus-within` keeps it reachable by keyboard.

```vue
<script setup lang="ts">
import { UIButton, UITooltip } from "@links/ui";

defineProps<{
  edge: "top" | "bottom";
}>();

const emit = defineEmits<{ insert: [] }>();
</script>

<template>
  <div
    class="absolute inset-x-0 z-2 flex justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100 max-md:opacity-100"
    :class="edge === 'top' ? '-top-3' : '-bottom-3'"
  >
    <UITooltip attach-side="top">
      <template #trigger>
        <UIButton
          icon="i-lucide:plus"
          size="xs"
          class="rounded-full! shadow-moon-lg"
          aria-label="Add a block here"
          data-testid="insert-block"
          @click="emit('insert')"
        />
      </template>
      <template #content> Add a block here </template>
    </UITooltip>
  </div>
</template>
```

- [ ] **Step 4: Render the markers from `PageBlock`**

In `page-block.vue`: add `index: number; isLast: boolean;` to `IPageBlockProps` with a one-line comment on `isLast`, extend the emits to `{ select: []; insert: [index: number] }`, add `group` to the root div's classes, and place the two markers as the first children of that root:

```vue
<InsertBlockButton edge="top" @insert="$emit('insert', index)" />
<InsertBlockButton v-if="isLast" edge="bottom" @insert="$emit('insert', index + 1)" />
```

with `import InsertBlockButton from "./insert-block-button.vue";`.

- [ ] **Step 5: Pass the index down and forward it up from `PageRenderer`**

In `page-renderer.vue`: add `defineEmits<{ insert: [index: number] }>();`, iterate by index, and pass `:index="index" :is-last="index === blocks.length - 1" @insert="(index) => $emit('insert', index)"`. Add the empty-page control inside `.link__container`, before the drag root:

```vue
<button
  v-if="!blocks.length"
  class="w-full border-(2 dashed) border-beerus rounded-moon-i-sm p-6 text-trunks transition-colors hover:(border-piccolo text-bulma)"
  data-testid="empty-page-add-block"
  @click="$emit('insert', 0)"
>
  Add your first block
</button>
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `pnpm --filter @links/web exec vitest run src/widgets/multilinks-constructor/ui/workspace src/widgets/multilinks-constructor/tests`
Expected: PASS, including `tests/theme.test.ts`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/widgets/multilinks-constructor/ui/workspace apps/web/src/widgets/multilinks-constructor/tests/insert-block.test.ts
git commit -m "feat(web): offer block insertion points in the constructor page"
```

---

### Task 4: One panel, three views, a toolbar switcher

**Files:**

- Create: `apps/web/src/widgets/multilinks-constructor/ui/properties-panel/views.ts`
- Modify: `apps/web/src/widgets/multilinks-constructor/model/provider.ts`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/toolbar/toolbar.vue`
- Modify: `apps/web/src/widgets/multilinks-constructor/multilinks-constructor.vue`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/theme-editor/theme-editor.vue`
- Modify: `apps/web/uno.config.ts`
- Modify: `apps/web/src/widgets/multilinks-constructor/tests/constructor.test.ts`
- Delete: `apps/web/src/widgets/multilinks-constructor/ui/toolbar/controls/set-background.vue`

**Interfaces:**

- Consumes: the three editors' barrels (`BlockPropertiesEditor`, `PagePropertiesEditor`, `ThemeEditor`).
- Produces: `PanelViewId = "blocks" | "page" | "theme"` and `PROPERTY_VIEWS: PropertyView[]` from `views.ts`; `ConstructorData { isMobile: Ref<boolean>; selectView(view: PanelViewId): void }`; `Toolbar` props `{ activeViewId: PanelViewId }` and event `select(view: PanelViewId)`. Task 5 calls `selectView` from `useConstructorData()`.

- [ ] **Step 1: Write the failing test**

Replace the body of `tests/constructor.test.ts` with a switcher test (the mount-only test is subsumed):

```ts
import { createTestingPinia } from "@pinia/testing";
import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import PageEditor from "../multilinks-constructor.vue";

describe("testing PageEditor widget", () => {
  function render() {
    return mount(PageEditor, { global: { plugins: [createTestingPinia({ createSpy: vi.fn })] } });
  }

  it("switches the panel between the three property views", async () => {
    const wrapper = render();
    await flushPromises();

    const buttons = wrapper.findAll("[data-testid='property-view-button']");
    expect(buttons.map((button) => button.attributes("aria-label"))).toEqual([
      "Blocks properties",
      "Page properties",
      "Theme properties",
    ]);
    expect(buttons[0]?.attributes("aria-pressed")).toBe("true");
    expect(wrapper.text()).toContain("Select a block to edit");

    await buttons[1]!.trigger("click");
    expect(wrapper.find("#page-title-input").exists()).toBe(true);
    expect(buttons[1]?.attributes("aria-pressed")).toBe("true");

    /* A page with no stored theme still shows the defaults: the first edit materialises them. */
    await buttons[2]!.trigger("click");
    expect(wrapper.get("input[aria-label='Accent colour']").element.value).toBe(DEFAULT_PAGE_THEME.accent);
  });
});
```

Import `DEFAULT_PAGE_THEME` from `@links/blocks`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @links/web exec vitest run src/widgets/multilinks-constructor/tests/constructor.test.ts`
Expected: FAIL — no `[data-testid='property-view-button']` and no Accent colour input.

- [ ] **Step 3: Write the view list**

Create `ui/properties-panel/views.ts`:

```ts
import type { Component } from "vue";

import type { PanelViewId } from "../../model/provider";

import { BlockPropertiesEditor } from "../block-properties-editor";
import { PagePropertiesEditor } from "../page-properties-editor";
import { ThemeEditor } from "../theme-editor";

export interface PropertyView {
  id: PanelViewId;
  /** Reached through data, so `uno.config.ts#safelist` names it: the extractor cannot see it. */
  icon: string;
  label: string;
  component: Component;
}

export const PROPERTY_VIEWS: PropertyView[] = [
  { id: "blocks", icon: "i-lucide:layout-list", label: "Blocks properties", component: BlockPropertiesEditor },
  { id: "page", icon: "i-lucide:file-text", label: "Page properties", component: PagePropertiesEditor },
  { id: "theme", icon: "i-lucide:palette", label: "Theme properties", component: ThemeEditor },
];

export const DEFAULT_VIEW_ID: PanelViewId = "blocks";
```

- [ ] **Step 4: Give the constructor context a view selector**

In `model/provider.ts`:

```ts
export type PanelViewId = "blocks" | "page" | "theme";

interface ConstructorData {
  isMobile: Ref<boolean>;
  selectView: (view: PanelViewId) => void;
}
```

- [ ] **Step 5: Turn the toolbar into the switcher**

In `toolbar.vue`, replace `AddBlock` and `SetBackground` with the view buttons, delete their imports, and add:

```ts
import type { PanelViewId } from "../../model/provider";

import { PROPERTY_VIEWS } from "../properties-panel/views";

defineProps<{ activeViewId: PanelViewId }>();
const emit = defineEmits<{ select: [view: PanelViewId] }>();
```

```vue
<div class="flex items-center justify-center gap-2 md:flex-col">
  <UITooltip v-for="view of PROPERTY_VIEWS" :key="view.id" attach-side="right">
    <template #trigger>
      <UIButton
        :icon="view.icon"
        :variant="view.id === activeViewId ? 'fill' : 'ghost'"
        :aria-label="view.label"
        :aria-pressed="view.id === activeViewId"
        data-testid="property-view-button"
        @click="emit('select', view.id)"
      />
    </template>
    <template #content> {{ view.label }} </template>
  </UITooltip>
</div>
```

`UITooltip` is already imported there for the separator section; add it to the existing `@links/ui` import if it is not.

- [ ] **Step 6: Drive the panel from the active view**

In `multilinks-constructor.vue`: drop the four `UITabs*` names from the `@links/ui` import and the whole `UITabs` element, replace the scroll area's children with the active view, add the mobile sheet, and provide `selectView`. The state goes after the existing `const isMobile = useMediaQuery(...)` line, which it reads:

```ts
const activeViewId = ref<PanelViewId>(DEFAULT_VIEW_ID);
const activeView = computed(() => PROPERTY_VIEWS.find((view) => view.id === activeViewId.value) ?? PROPERTY_VIEWS[0]!);
const isPanelOpen = ref(false);

/* Switching the view is not the same as asking to see it: inserting a block switches silently. */
function selectView(view: PanelViewId) {
  activeViewId.value = view;
}

function chooseView(view: PanelViewId) {
  selectView(view);
  if (isMobile.value) isPanelOpen.value = true;
}

provide(CONSTRUCTOR_INJECTION_KEY, { isMobile, selectView });
```

with `import { DEFAULT_VIEW_ID, PROPERTY_VIEWS } from "./ui/properties-panel/views";` and `import type { PanelViewId } from "./model/provider";`. Template, replacing the tabs:

```vue
<UIScrollArea
  v-if="!isMobile"
  orientation="vertical"
  class="border-(x beerus) bg-gohan p-2 lg:max-w-sm lg:min-w-sm"
  bar-class="rounded-none"
  thumb-class="bg-trunks"
>
  <component :is="activeView.component" />
</UIScrollArea>
<UISheet.Root v-else v-model:open="isPanelOpen">
  <UISheet.Content side="bottom" class="max-h-[85vh] overflow-y-auto">
    <UISheet.Header>
      <UISheet.Title>{{ activeView.label }}</UISheet.Title>
      <VisuallyHidden>
        <UISheet.Subtitle>Properties of this page</UISheet.Subtitle>
      </VisuallyHidden>
    </UISheet.Header>
    <component :is="activeView.component" />
  </UISheet.Content>
</UISheet.Root>
```

with `UISheet` added to the `@links/ui` import and `import { VisuallyHidden } from "reka-ui";`. Pass `:active-view-id="activeViewId" @select="chooseView"` to `<Toolbar>`.

- [ ] **Step 7: Let the panel own the scrolling**

In `theme-editor.vue`, drop the `UIScrollArea` wrapper (and its import) so the root is the flex column, keeping the existing paddings: `<div class="flex flex-col gap-6 p-4 pb-10">`.

- [ ] **Step 8: Safelist the view icons**

In `apps/web/uno.config.ts`, extend the safelist with a comment naming why:

```ts
/* The properties panel's view icons arrive as data, so the extractor never sees them. */
"i-lucide:layout-list",
"i-lucide:file-text",
"i-lucide:palette",
```

- [ ] **Step 9: Delete the theme sheet**

```bash
git rm apps/web/src/widgets/multilinks-constructor/ui/toolbar/controls/set-background.vue
```

- [ ] **Step 10: Run the tests to verify they pass**

Run: `pnpm --filter @links/web exec vitest run src/widgets/multilinks-constructor`
Expected: PASS. Then `pnpm --filter @links/web exec vue-tsc --noEmit -p tsconfig.typecheck.json` — no errors from the removed tabs.

- [ ] **Step 11: Commit**

```bash
git add apps/web/uno.config.ts apps/web/src/widgets/multilinks-constructor
git commit -m "feat(web): switch constructor properties with the toolbar, theme included"
```

---

### Task 5: The palette moves into the workspace

**Files:**

- Modify: `apps/web/src/widgets/multilinks-constructor/ui/workspace/workspace.vue`
- Delete: `apps/web/src/widgets/multilinks-constructor/ui/toolbar/controls/add-block.vue`

**Interfaces:**

- Consumes: `PageRenderer`'s `insert(index)` (Task 3), `BlocksList`'s `select(name)` (Task 2), `addBlock(name, index)` (Task 1), `selectView("blocks")` (Task 4).
- Produces: nothing later tasks use.

- [ ] **Step 1: Own the palette and the pending index**

In `workspace.vue`:

```ts
import type { BlockName } from "@links/blocks";

import { UISheet } from "@links/ui";

import { useConstructorStore } from "../../model";
import { useConstructorData } from "../../model/provider";
import { BlocksList } from "../blocks-list";

const { isMobile, selectView } = useConstructorData();
const constructorStore = useConstructorStore();
const { addBlock } = constructorStore;

/* The gap a palette pick will insert into; `null` until a marker is clicked. */
const insertIndex = ref<number | null>(null);
const isPaletteOpen = ref(false);

function openPalette(index: number) {
  insertIndex.value = index;
  isPaletteOpen.value = true;
}

function insertBlock(name: BlockName) {
  addBlock(name, insertIndex.value ?? undefined);
  selectView("blocks");
  isPaletteOpen.value = false;
}
```

and the sheet after the existing grid, plus `@insert="openPalette"` on both `PageRenderer` renders:

```vue
<UISheet.Root v-model:open="isPaletteOpen">
  <UISheet.Content side="left">
    <UISheet.Header>
      <UISheet.Title>Add Block</UISheet.Title>
      <UISheet.Subtitle>Select a block to add</UISheet.Subtitle>
    </UISheet.Header>
    <BlocksList @select="insertBlock" />
  </UISheet.Content>
</UISheet.Root>
```

- [ ] **Step 2: Delete the toolbar palette**

```bash
git rm apps/web/src/widgets/multilinks-constructor/ui/toolbar/controls/add-block.vue
```

Its `BlocksList` import and any leftover reference in `toolbar.vue` go with it; `toolbar.vue` no longer imports anything from `../../blocks-list`.

- [ ] **Step 3: Run the constructor's tests and typecheck**

Run: `pnpm --filter @links/web test`
Expected: PASS — including the typecheck step, which is what would catch a dangling `add-block.vue` import.

- [ ] **Step 4: Exercise it in a browser**

Run: `pnpm dev`, open the constructor for a page with three blocks, and check:

1. Hovering a block edge shows the `+` between blocks — check it over a full-bleed Picture block and inside the phone mockup's rounded corners; clicking one in the middle opens the palette, and the picked block lands in that gap, selected, with the panel switched to Blocks properties.
2. Dragging blocks still reorders them and does not drag a `+`.
3. Deleting every block leaves "Add your first block", which inserts at the top.
4. The three toolbar buttons switch the panel; Theme properties edits the page live and needs no sheet.
5. At a phone width: the toolbar buttons open a bottom sheet, the theme editor scrolls to its last field ("Colour scheme"), and the `+` markers are visible without hover. Adding a block there must not also pop that panel open — only a view button does.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/widgets/multilinks-constructor
git commit -m "feat(web): add blocks from the page instead of a toolbar sheet"
```

---

## Final gate

Run: `pnpm verify`
Expected: lint, fmt, build and tests all pass. Only `apps/web` changed, so no library rebuild is needed for the run; `verify` builds them anyway.
