# Gallery: a carousel with themed controls

## Why

The gallery's horizontal layout was a scroll strip: two images shared the viewport, there was no
control of any kind, and a visitor without a trackpad could not tell it moves. It read as a grid that
happened to overflow. A gallery needs a way to step through one picture at a time, a way to see how
many are left, and a control that works with a finger.

## Goals

1. The horizontal layout becomes **Carousel**: one image in the viewport, `‹` and `›` buttons over the
   image edges, and a dot per image below it that jumps to that image.
2. Every control reads the page theme. The arrows wear the theme's button tokens (surface, glyph,
   border, so `solid`/`outline`/`ghost` reaches them) and `--links-page-radius`, and sit half
   transparent over the picture (`0.72`, opaque on hover/focus, `0.35` when disabled). The active dot
   is `--links-page-accent`, the rest are the page's text colour, and focus rings are the accent.
3. The image corners follow the page theme's radius. The block has no radius of its own: one owner-set
   value would disagree with every other block on a themed page.
4. The grid layout gains a **1** column option: 1, 2, 3, 4.
5. Every row carries its own `new-tab` switch beside its link, the way the button block does, because
   one image may stay on the site while the next leaves it.
6. A page published with the old `strip` layout keeps a sideways look: the schema migration rewrites
   the option and a stored value, and the renderer reads the legacy id as the carousel until that page
   is opened in the constructor.

## Non-goals

- No swipe handling in script: a swipe is the platform scrolling a real scroll container, and the
  block only reads where that scroll stopped. No `touchstart`/`touchmove` plumbing.
- No autoplay, no wrap-around (arrows stop at the ends and are disabled there), no thumbnails, no
  keyboard handling beyond the native buttons.
- No per-block radius control, no change to the other layouts, the theme model, or the backend.
- No `@links/ui`: the arrows and dots are plain elements styled from the page variables, because a
  block component may not use the kit or its UnoCSS utilities.

## Design

### Schema (`packages/blocks/src/blocks/gallery.ts`)

- `BLOCK_VERSION` 0 → 1 → 2.
- Version 1 renames the horizontal layout: `layout` options become `Grid` / `Carousel`
  (`grid` / `carousel`), `Strip` and its `strip` value go, and `columns` gains `1` (1, 2, 3, 4) with
  the hint "How many images sit side by side in a grid; the carousel shows one at a time".
- Version 2 gives the row fields a `new-tab` switch (`boolean`, `variant: "switch"`, default `true`,
  the way the button block opens its link) and drops the block's `radius` property, because the image
  corners now come from the page theme.
- One `itemFields()` list serves the factory and both migration steps, so a stored Gallery ends with
  exactly the shape `createBlock` writes today.
- Both steps mutate the stored property objects **in place**, so a page keeps the layout it chose
  (`strip` moving to `carousel`) and the rows it holds.

### Renderer (`apps/web/src/shared/blocks/components/gallery-block.vue`)

- `LAYOUTS = ["grid", "carousel"]`; `layoutOf` answers `carousel` for a stored `strip` and `grid` for
  anything outside the set.
- `columnCount` clamps to `[1, 4]` with 2 as the fallback, and the block emits both
  `--gallery-columns` and `--gallery-columns-narrow` (`min(count, 2)`, computed in script). The 640px
  cap applies to the narrow variable, so a one-column grid stays one column on a phone while four
  tracks still collapse to two.
- One markup for every layout: a `__viewport` holding a `__track`, and the items inside it. The grid
  layout puts `display: grid` on the track. The carousel makes the viewport the scroll container
  (`overflow-x: auto`, `scroll-snap-type: x mandatory`, scrollbar hidden, `overscroll-behavior-x:
  contain`) and the track `display: contents`, so the items are full-width flex children with a snap
  point each. `grid-template-columns: minmax(0, 1fr)` keeps the column from growing to the widest
  slide, and one item of `flex: 0 0 100%` with no gap is what puts exactly one image in the viewport.
- The scroller is the source of truth. `syncIndex` reads `scrollLeft / clientWidth` on every scroll
  and clamps the result, so dots follow a swipe; `show(next)` clamps the index and asks the scroller
  for `index × clientWidth`. Deleting the shown row lands on the last one left instead of an empty
  slide.
- Controls render only when there is more than one image: a disabled `‹` on the first image, a
  disabled `›` on the last, and one dot per image with `aria-current="true"` on the current one and
  `aria-label="Image N"`. The arrows carry `aria-label="Previous image"` / `"Next image"` — the
  block's own chrome is hardcoded English elsewhere too (`Buy` in Products).
- Chevrons are inline SVG with `stroke="currentColor"`: an icon class would come from the UnoCSS
  preset, which a block component may not use.
- A row with a link becomes an anchor with `target="_blank"` and `rel="noopener noreferrer"` unless
  its `new-tab` is `false`; a row stored before the switch existed opens in a new tab, which is what
  the button block has always done. A row whose link is not a web address stays a plain element.

### Constructor

The selection overlay already sits above the block and takes the click, so the controls are inert
until the block is opened — the same as an FAQ row or a form field. Nothing changes there.

### Risks

- **Legacy pages.** Public pages never run `migrateBlock`, so the schema migration alone would turn
  every stored `strip` page into a grid. The renderer's alias is what keeps those pages sideways.
- **Lost choice.** The migration must not replace the stored `layout` object wholesale, or a page that
  chose `strip` loses its value on the next save.
- **Stale schema.** A block whose version equals the module's is never migrated: a page saved as v1
  keeps its `radius` property until something bumps the version. The renderer ignores that property,
  so the corners still follow the theme.
- **Narrow grid.** `repeat()` takes an integer, so the 640px cap cannot clamp a variable with `min()`;
  hence the second variable.
- **Scroll container width.** The viewport must keep `min-width: 0` and a `minmax(0, 1fr)` column, or
  the widest slide would decide the track's width and one swipe would move more than one image.

## Tests

- `packages/blocks/test/contract.test.ts`: a stored v0 gallery with `layout.value === "strip"`
  migrates to `carousel`, a stored `grid` stays `grid`, a stored `radius` goes and every row gains the
  `new-tab` switch, and the schema snapshot is refreshed.
- `apps/web/src/shared/blocks/components/block-components.test.ts`: the carousel class, dot state
  after each step, arrows disabled at the ends, the scroller asked for `index × clientWidth`, the dots
  following a scroll, no controls for a single image, the `strip` alias, the column range widening to
  1, the per-row `new-tab` target and rel, and the image corners left to the theme.
