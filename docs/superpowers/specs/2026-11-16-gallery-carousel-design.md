# Gallery: a carousel with themed controls

## Why

The gallery's horizontal layout is a scroll strip: two images share the viewport, there is no control
of any kind, and a visitor without a trackpad cannot tell it moves. It reads as a grid that happens to
overflow. A gallery needs a way to step through one picture at a time and a way to see how many are
left.

## Goals

1. The horizontal layout becomes **Carousel**: one image in the viewport, `‹` and `›` buttons over the
   image edges, and a dot per image below it that jumps to that image.
2. Every control reads the page theme: arrows use the theme's button tokens (surface, glyph, border,
   so `solid`/`outline`/`ghost` reaches them) and `--links-page-radius`; the active dot is
   `--links-page-accent`, the rest are the page's text colour; focus rings are the accent.
3. The grid layout gains a **1** column option: 1, 2, 3, 4.
4. A page published with the old `strip` layout keeps a sideways look: the block schema moves to
   version 1, whose migration rewrites the option and a stored value, and the renderer reads the
   legacy id as the carousel until that page is opened in the constructor.

## Non-goals

- No swipe/drag handling in script: the track is moved by CSS `transform`, driven by an index.
- No autoplay, no wrap-around (arrows stop at the ends and are disabled there), no thumbnails, no
  keyboard handling beyond the native buttons.
- No change to the item fields, the other layouts, the theme model, or the backend.
- No `@links/ui`: the arrows and dots are plain elements styled from the page variables, because a
  block component may not use the kit or its UnoCSS utilities.

## Design

### Schema (`packages/blocks/src/blocks/gallery.ts`)

- `BLOCK_VERSION` 0 → 1.
- `layout` options: `Grid` / `Carousel` (`grid` / `carousel`). `Strip` and its `strip` value go.
- `columns` options: 1, 2, 3, 4; the hint now reads "How many images sit side by side in a grid; the
  carousel shows one at a time".
- `migrateBlock`, version 0 → 1: rewrite `layout.options` and `columns.options`/`hint` in place so the
  definitions match the factory, and rewrite a stored `layout.value === "strip"` to `"carousel"`,
  keeping the rest of the stored value (`grid`, or nothing) as it is.

### Renderer (`apps/web/src/shared/blocks/components/gallery-block.vue`)

- `LAYOUTS = ["grid", "carousel"]`; `layoutOf` answers `carousel` for a stored `strip` and `grid` for
  anything outside the set.
- `columnCount` clamps to `[1, 4]` with 2 as the fallback, and the block emits both
  `--gallery-columns` and `--gallery-columns-narrow` (`min(count, 2)`, computed in script). The
  existing 640px cap applies to the narrow variable, so a one-column grid stays one column on a phone
  while four tracks still collapse to two.
- One markup for every layout: a `__viewport` holding a `__track`, and the items inside it. The grid
  layout puts `display: grid` on the track; the carousel puts `display: flex` on it, `overflow: hidden`
  on the viewport, hides the scrollbar, and translates the track by `--gallery-index × -100%`. Items
  are `flex: 0 0 100%` with no gap, so exactly one image fills the viewport and the offset is exact.
- State: `const index = ref(0)`, and `current` clamps it to `rows.length - 1` so a deleted row never
  leaves the carousel on an empty slide. `show(next)` clamps and sets it.
- Controls render only when there is more than one image: a disabled `‹` on the first image, a
  disabled `›` on the last, and one dot per image with `aria-current="true"` on the current one and
  `aria-label="Image N"`. The arrows carry `aria-label="Previous image"` / `"Next image"` — the
  block's own chrome is hardcoded English elsewhere too (`Buy` in Products).
- Chevrons are inline SVG with `stroke="currentColor"`: an icon class would come from the UnoCSS
  preset, which a block component may not use.

### Constructor

The selection overlay already sits above the block and takes the click, so the controls are inert
until the block is opened — the same as an FAQ row or a form field. Nothing changes there.

### Risks

- **Percentage translate.** The track must be the viewport's width, not the sum of its slides: flex
  children overflow a block-level track, so `-100%` is one viewport. A track widened to its content
  would step by the whole gallery instead.
- **Legacy pages.** Public pages never run `migrateBlock`, so the schema migration alone would turn
  every stored `strip` page into a grid. The renderer's alias is what keeps those pages sideways.
- **Lost choice.** The migration must not replace the stored `layout` object wholesale, or a page that
  chose `strip` loses its value on the next save.
- **Narrow grid.** `repeat()` takes an integer, so the 640px cap cannot clamp a variable with `min()`;
  hence the second variable.

## Tests

- `packages/blocks/test/contract.test.ts`: a stored v0 gallery with `layout.value === "strip"`
  migrates to version 1 with `carousel`, a stored `grid` stays `grid`, and the schema snapshot is
  refreshed.
- `apps/web/src/shared/blocks/components/block-components.test.ts`: the carousel class, one index per
  step, arrows disabled at the ends, dot count and `aria-current`, a dot jump, no controls for a
  single image, the `strip` alias, and the column range widening to 1.
