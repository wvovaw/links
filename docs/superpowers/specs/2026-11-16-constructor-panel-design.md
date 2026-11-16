# Constructor: one panel, three views, blocks inserted in place

## Why

After living with the constructor, the properties surface is spread across three mechanisms: tabs inside
the left panel (`Block Properties` / `Page properties`), a sheet for the page theme, and a sheet for the
block palette. The two tabs and the two toolbar buttons are the same idea twice, and the theme — the
thing a user tweaks most while looking at the page — is the only property set that throws the panel away
and covers the workspace.

Adding a block has the mirror problem: the only insert point is the end of the page, so placing a block
anywhere else means adding it, then dragging it up.

## Goals

1. One switcher, three properties views, and a fourth view costs one entry in a list.
2. The theme is edited in the panel, like every other property set.
3. A block is inserted at the position the user points at, from the page itself.
4. Mobile keeps every view reachable, and the theme stops being the only one that is.

## Non-goals

- No persistence of the active view (no URL, no storage).
- No insertion-by-drag markers, no change to reordering; `@formkit/drag-and-drop` stays as it is.
- No new i18n keys: the constructor's own strings stay hardcoded English, as they are today.
- No change to the block schema, the theme model, or the backend.

## Current state

- `ui/toolbar/toolbar.vue` holds two icon buttons above a separator and the undo/redo, save and back
  controls: `controls/add-block.vue` (tooltip + sheet + `BlocksList`) and `controls/set-background.vue`
  (tooltip + sheet + `ThemeEditor`).
- `multilinks-constructor.vue` renders, desktop only (`v-if="!isMobile"`), a `UIScrollArea` with
  `UITabs` over `BlockPropertiesEditor` and `PagePropertiesEditor`.
- `ui/theme-editor/theme-editor.vue` brings its own `UIScrollArea`.
- On mobile the panel does not exist: block properties come from the pencil in `edit-block-action.vue`
  (a drawer), the theme only from the sheet, and page properties are unreachable.
- `ui/workspace/page-renderer.vue` mounts `dragAndDrop` on `link__blocks-root`, so the direct children of
  that element are exactly the drag nodes; the blocks are `PageBlock` wrappers.

## Design

### The panel and its switcher

The tabs go. `multilinks-constructor.vue` keeps an `activeView` ref and a list:

```ts
const views = [
  { id: "blocks", icon: "i-lucide:layout-list", label: "Blocks properties", component: BlockPropertiesEditor },
  { id: "page", icon: "i-lucide:file-text", label: "Page properties", component: PagePropertiesEditor },
  { id: "theme", icon: "i-lucide:palette", label: "Theme properties", component: ThemeEditor },
];
```

The panel renders `<component :is="activeView.component" />` inside the existing `UIScrollArea`; the
toolbar renders one button per entry, in the slot where `Add block` and `Page theme` sit today, above the
existing separator, with the view's label as its tooltip and an active state so the current view is
visible at rest. A fourth view is one entry plus its icon in `uno.config.ts#safelist` — those icons reach
the template as data, so the extractor cannot see them.

Actions and views stay apart: views above the separator, undo/redo, save and back below it.

### Mobile

The same three buttons drive the same `activeView`, but the editor opens in a `UISheet` from the bottom
with the view's label as its title. That is where the theme sheet already lived, so nothing is lost, and
page properties become reachable for the first time. The pencil drawer on a block is untouched.

### Theme editor

`ui/theme-editor/theme-editor.vue` loses its `UIScrollArea` — the panel scrolls, and the mobile sheet
scrolls internally — and is otherwise unchanged. `controls/set-background.vue` is deleted.

### Inserting a block in place

- Store: `addBlock(name, index = blocks.length)` inserts with `splice(index, 0, …)` and still selects the
  new block.
- `PageBlock` renders an insertion control on its top edge (`index` of that block), and the last block
  also renders one on its bottom edge (`index === blocks.length`). Each one shows on hover of the block,
  and on mobile it is always visible.
- The control lives *inside* the `PageBlock` wrapper, not as a sibling: `dragAndDrop` takes every direct
  child of `link__blocks-root` as a drag node, so an extra sibling would become a draggable "block".
- An empty page renders a dashed "Add your first block" area in place of the list, inserting at `0`.
- Clicking a control records the index and opens the palette sheet (`BlocksList`, unchanged); picking a
  block inserts it there. The sheet is owned by the workspace, so the "Add a block" button in the toolbar
  goes away and the toolbar becomes a pure view switcher.

### Selection

Adding a block switches the desktop panel to `Blocks properties` — otherwise the block appears and the
panel keeps showing the theme. Plain click-to-select does not switch views: it would yank the panel away
from a user who is tuning the theme while looking at the page.

## Risks and checks

- **Drag and drop**: the drag nodes must stay exactly the `PageBlock` wrappers. Reorder a few blocks in a
  browser after the change.
- **Hover-only controls**: invisible on touch and to the keyboard. Always visible on mobile, and shown on
  `focus-within` on desktop.
- **Scroll**: removing the theme editor's own scroll area must not leave the mobile sheet with unreachable
  content.
- **Placement over content**: a marker sits on the block's top edge, over the block below it. Check it
  against a full-bleed picture block and a 40px-radius phone mockup.

## Left to the builder

- Exact icons, marker styling (size, offset, hover ring), and the safelist lines.
- Test shape: store insertion at an index, the switcher rendering three views and switching, an
  insertion control emitting its index.
