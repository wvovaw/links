# List rows: collapsed rows and arrow reordering

## Why

The list editor (`block-properties-editor/fields/list-field.vue`) is the one editor behind every
repeating block — FAQ questions, gallery images, products, testimonials. It draws every row in full,
always, and order is changed only by dragging a `grip-vertical` handle.

Both hurt at the sizes the schemas already allow. FAQ takes 40 rows of two fields, one of them a
multiline answer; products take 6 fields per row including an upload; testimonials take 5. A
half-filled list is a column thousands of pixels long with no outline, so finding a row is scrolling
and the shape of the list is invisible. Reordering is a pointer-only gesture that needs precision,
says nothing about where a row landed, and cannot be done with a keyboard.

## Goals

1. A row collapses: its header shows `Row N` and a one-line summary of the row's content, and a
   chevron toggles it. Toggles are independent — several rows may be open at once.
2. The summary is the first non-empty item field's value, ellipsised, in the order the schema
   declares the fields. An `image` value contributes the last segment of its stored name, the string
   the image field already shows beside the preview.
3. A row whose required item fields are blank says so in its header (`Required: Question`): a row
   that would not be drawn is worth seeing while it is still collapsed.
4. Up and down buttons replace the drag handle: two icon buttons per row, disabled on the first and
   last row, swapping the row with its neighbour in the model.
5. `@formkit/drag-and-drop` leaves this component entirely — no handle, no `onMounted` wiring, no
   `tearDown`.

## Non-goals

- Block-level dragging in `page-renderer.vue` stays as it is; the dependency stays in
  `apps/web/package.json` for it.
- No thumbnails or previews in a collapsed header, and no icon or colour per row.
- The open set is editor UI state, not part of the block: reopening a page starts with every row
  collapsed, and nothing about it is saved.
- No "expand all" / "collapse all", no "move to top/bottom", no keyboard shortcut beyond the buttons
  being real buttons.
- No new component in `@links/ui`, no change to `packages/blocks` schemas or to `listRows` /
  `itemFieldsOf`; item fields, defaults, `minItems` / `maxItems` and the stored block are untouched.
- No test-id or behaviour change for anything outside this component.

## Approaches

- **A — collapsed rows with a summary, independent toggles (picked).** The header carries `Row N`, the
  summary and the required-by-name marker; a new row is added open, the rest start collapsed. On the
  40-question FAQ this is the whole point: the list becomes an outline. Costs a summary rule and
  keeping the open set straight across insert, duplicate, remove and move.
- **B — `Row N` only, all collapsed.** Less code, but every collapsed row of every block reads the
  same, so a list stays anonymous — for gallery rows, which are images, the header would say nothing
  at all.
- **C — accordion, exactly one row open.** Keeps the panel short on its own, but comparing two rows
  (the usual reason to open a second one) becomes impossible, and it needs a rule for what happens to
  the row you just edited.

## Design

All of it in `apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.vue`.

**Collapse mechanism — reka-ui primitives, not `UIAccordion`.** `AccordionRoot type="multiple"` +
`AccordionItem` + `AccordionHeader` + `AccordionTrigger` + `AccordionContent` imported straight from
`reka-ui` (already a direct dependency of `apps/web`, and already imported in four widgets here).
The kit's `UIAccordion.Trigger` is unusable in this position: it is a `<button>` with its own padded,
`bg-goku` bar, and the row header has to carry up/down/duplicate/remove, which cannot be buttons
nested inside it. The primitives give `data-state` for the chevron, the aria wiring and keyboard
handling, and leave the row's own border and padding alone. Hand-rolling `aria-expanded` + `v-show`
was the fallback if the primitives fight the layout.

**Markup.** Each row is an `AccordionItem :value="index"` keeping `data-testid="list-row"` and its
`border border-beerus rounded-moon-i-sm`. Inside it, one flex row: the `AccordionHeader`/`Trigger`
takes the left side (`min-w-0`, holding the chevron, `Row N`, the summary and the required marker) and
the action buttons sit beside it as siblings — `ml-auto`, neither inside the trigger nor wrapping it.
`AccordionContent` holds the item fields, so a collapsed row mounts no inputs at all.

**Open set.** `const openRows = ref<number[]>([])`, bound with `v-model` on the root. It is indices,
like the row keys. Insert, duplicate, remove and move each fix it up through one small helper: adding
opens only the new row (shifting later indices), removing drops it, moving swaps the two entries so
the row keeps the state it had.

**Reordering.**

```ts
function moveRow(index: number, offset: -1 | 1) {
  const target = index + offset;
  if (target < 0 || target >= rows.value.length) return;
  const next = [...rows.value];
  [next[index], next[target]] = [next[target]!, next[index]!];
  setRows(next);
}
```

Buttons: `i-lucide:arrow-up` / `i-lucide:arrow-down`, ghost, `sm`, `data-testid="list-move-up"` /
`"list-move-down"`, `aria-label="Move row up"` / `"Move row down"`, disabled at the ends. Header
order: up, down, duplicate, remove.

**Summary and marker.** Two pure helpers over a row: the first non-empty item field's value
(trimmed, last path segment for `image`, `truncate` in the template), and the labels of the required
item fields that are blank. Blankness is a local three-line check mirroring the private `hasContent`
in `packages/blocks/src/list.ts`; exporting it was not worth a library rebuild for one caller.

## Risks

- **Index keys follow the position, not the row.** Reordering by buttons moves values between
  positions, so the open set has to move with them or a collapsed row swaps into an open slot. The
  helper above is where that is decided; it is also the part most worth a test.
- **`type="multiple"` is load-bearing** — reka-ui's root defaults to `single`, which is rejected
  option C, and the failure is silent.
- **A collapsed row mounts no inputs**, so existing tests that type into `#field-0-row-1-title`
  straight after mount have to open the row first. That is the behaviour being tested, not a
  workaround.
- **The header is a flex row with a trigger in it.** The trigger must not grow to swallow the buttons
  (`ml-auto` sibling, `min-w-0` on the trigger) or the buttons stop receiving clicks.

## Tests

`apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/list-field.test.ts`:
rows mount collapsed and the item fields do not exist until the header is clicked; the header shows
the first non-empty value, an empty row shows none, an image row shows its stored name; a blank
required field is named and the marker goes once it is filled; an added row arrives open; up/down
swap the model rows and are disabled on the first and last row; and no `list-drag` handle is rendered.
The existing add/duplicate/remove/value-binding/max-min tests stay, opening a row where they type.
