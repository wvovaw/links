<script setup lang="ts">
import type { BlockProperty, IBlockPropertyList, IBlockPropertySelect } from "@links/blocks";

import { completeRows } from "@links/blocks";
import { resolveBlockImageUrl } from "~shared/blocks";
import { clampNumber } from "~shared/blocks/clamp-number";
import { webHref } from "~shared/blocks/link-url";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const config = useRuntimeConfig();

const LAYOUTS = ["grid", "carousel"] as const;
type GalleryLayout = (typeof LAYOUTS)[number];

/** The shape comes from stored data: anything outside the closed set draws a square. */
const ASPECTS = { "1:1": "1 / 1", "4:3": "4 / 3", "16:9": "16 / 9" } as const;

/**
 * A page that chose the retired `strip` keeps a sideways layout: it reads as the carousel that
 * replaced it. Public pages never run `migrateBlock`, so only the renderer knows the old id, while the
 * constructor rewrites it on the next visit.
 */
function layoutOf(value: string | undefined): GalleryLayout {
  if (value === "strip") return "carousel";

  return LAYOUTS.find((layout) => layout === value) ?? "grid";
}

function aspectOf(value: string | undefined): string {
  return value === "4:3" || value === "16:9" ? ASPECTS[value] : ASPECTS["1:1"];
}

/**
 * `repeat()` takes a whole number of tracks while the field stores text, so the value is parsed and
 * clamped here: the field offers 1, 2, 3 and 4, and a stored `"9"`, `"many"` or `""` still draws a grid.
 */
function columnCount(value: string | undefined): number {
  return Math.round(clampNumber(Number(value), 1, 4, 2));
}

type GalleryRow = { image: string; alt: string; link: string | null; newTab: boolean };

const bp = computed(() => {
  const p = props.properties;
  const columns = columnCount((p.columns as IBlockPropertySelect | undefined)?.value);

  return {
    layout: layoutOf((p.layout as IBlockPropertySelect | undefined)?.value),
    /*
      A row with no image has nothing to draw, and neither has one whose image is not a string: the
      stored block is unvalidated JSON, so `image: 42` is a row `completeRows` keeps and
      `resolveBlockImageUrl` has no url for. Both are dropped rather than painted as a broken image.
    */
    rows: completeRows(p.items as IBlockPropertyList | undefined).flatMap((row): GalleryRow[] => {
      const image =
        typeof row.image === "string"
          ? resolveBlockImageUrl(row.image, { origin: config.public.backendUrl })
          : undefined;
      if (!image) return [];

      /*
        The row's link is free text the API never validates, so a `javascript:` value in `href` would
        run in the page's own origin on click: only a web address becomes an anchor. The `new-tab`
        switch belongs to the row, and a row stored before it existed opens in a new tab, which is
        what the button block has always done.
      */
      const link = webHref(row.link);

      return [
        {
          image,
          alt: typeof row.alt === "string" ? row.alt : "",
          link,
          newTab: link !== null && row["new-tab"] !== false,
        },
      ];
    }),
    style: {
      "--gallery-columns": `${columns}`,
      /*
        `repeat()` takes an integer, so the narrow-screen cap cannot clamp a variable with `min()`:
        four tracks leave 66px each on a phone, and the block ships the capped count beside the
        stored one. One track is already the narrowest grid and keeps its single image.
      */
      "--gallery-columns-narrow": `${Math.min(columns, 2)}`,
      "--gallery-aspect": aspectOf((p.aspect as IBlockPropertySelect | undefined)?.value),
    },
  };
});

/**
 * The carousel's slide. The scroller is the source of truth: a swipe moves it natively, the dots
 * follow where it stopped, and a button only asks it to go somewhere. `current` clamps, so deleting
 * the shown row lands on the last one left instead of on an empty slide.
 */
const viewport = ref<HTMLElement | null>(null);
const index = ref(0);

const current = computed(() => slideOf(index.value));

function slideOf(next: number): number {
  return clampNumber(next, 0, Math.max(bp.value.rows.length - 1, 0), 0);
}

function syncIndex(event: Event) {
  const scroller = event.currentTarget as HTMLElement;
  /* Before layout — and under a test DOM — the width is zero, and the division would be no advice. */
  if (!scroller.clientWidth) return;

  index.value = slideOf(Math.round(scroller.scrollLeft / scroller.clientWidth));
}

function show(next: number) {
  index.value = slideOf(next);

  const scroller = viewport.value;
  scroller?.scrollTo?.({ left: index.value * scroller.clientWidth, behavior: "smooth" });
}
</script>

<template>
  <div class="gallery-block" :class="`gallery-block--${bp.layout}`" :style="bp.style">
    <div ref="viewport" class="gallery-block__viewport" @scroll="syncIndex">
      <div class="gallery-block__track">
        <component
          :is="row.link ? 'a' : 'div'"
          v-for="(row, position) of bp.rows"
          :key="position"
          class="gallery-block__item"
          :href="row.link || undefined"
          :target="row.newTab ? '_blank' : undefined"
          :rel="row.newTab ? 'noopener noreferrer' : undefined"
        >
          <img class="gallery-block__image" :src="row.image" :alt="row.alt" loading="lazy" />
        </component>
      </div>
    </div>
    <!-- One image has nowhere to step to, so the controls would lead nowhere. -->
    <template v-if="bp.layout === 'carousel' && bp.rows.length > 1">
      <button
        type="button"
        class="gallery-block__nav gallery-block__nav--prev"
        aria-label="Previous image"
        :disabled="current === 0"
        @click="show(current - 1)"
      >
        <svg class="gallery-block__chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="m15 6-6 6 6 6" />
        </svg>
      </button>
      <button
        type="button"
        class="gallery-block__nav gallery-block__nav--next"
        aria-label="Next image"
        :disabled="current === bp.rows.length - 1"
        @click="show(current + 1)"
      >
        <svg class="gallery-block__chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </button>
      <div class="gallery-block__dots">
        <button
          v-for="(row, dot) of bp.rows"
          :key="dot"
          type="button"
          class="gallery-block__dot"
          :class="{ 'gallery-block__dot--current': dot === current }"
          :aria-current="dot === current ? 'true' : undefined"
          :aria-label="`Image ${dot + 1}`"
          @click="show(dot)"
        />
      </div>
    </template>
  </div>
</template>

<style>
/*
  A block with nothing to draw still measures one line, so the constructor keeps a box to select; the
  public page shows the same empty box, which is invisible.
*/
.gallery-block {
  width: 100%;
  min-height: 2rem;
  color: var(--links-page-fg);
}

/*
  Every layout stacks the same track of items, so the only thing a layout decides is how the track
  arranges them. The grid caps its tracks on a phone: the page container is 640px wide at most, and
  below that four images at 320px leave 66px each.
*/
.gallery-block--grid .gallery-block__track {
  display: grid;
  grid-template-columns: repeat(var(--gallery-columns, 2), 1fr);
  gap: 0.5rem;
}
@media (max-width: 639px) {
  .gallery-block--grid .gallery-block__track {
    grid-template-columns: repeat(var(--gallery-columns-narrow, 2), 1fr);
  }
}

/*
  The carousel is one grid cell holding the scroller, with the arrows layered on top of it in the same
  cell: a swipe drags a real scroll container, so a phone gets the platform's own scrolling, momentum
  and snapping. `minmax(0, 1fr)` keeps the column from growing to the widest slide, and one full-width
  slide with no gap is what puts exactly one image in the viewport.
*/
.gallery-block--carousel {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}
.gallery-block--carousel .gallery-block__viewport {
  display: flex;
  grid-area: 1 / 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.gallery-block--carousel .gallery-block__viewport::-webkit-scrollbar {
  display: none;
}
.gallery-block--carousel .gallery-block__track {
  display: contents;
}
.gallery-block--carousel .gallery-block__item {
  flex: 0 0 100%;
  scroll-snap-align: start;
}
.gallery-block--carousel .gallery-block__nav {
  grid-area: 1 / 1;
  align-self: center;
}
.gallery-block--carousel .gallery-block__nav--prev {
  justify-self: start;
  margin-inline-start: 0.5rem;
}
.gallery-block--carousel .gallery-block__nav--next {
  justify-self: end;
  margin-inline-end: 0.5rem;
}
.gallery-block--carousel .gallery-block__dots {
  grid-area: 2 / 1;
}

/* The rounding and the crop belong to the item, so the image cannot paint outside it. */
.gallery-block__item {
  display: block;
  line-height: 0;
  overflow: hidden;
  border-radius: var(--links-page-radius, 10px);
}
/* The ratio reserves the box before the file arrives, so a slow image does not shift the page. */
.gallery-block__image {
  display: block;
  width: 100%;
  aspect-ratio: var(--gallery-aspect, 1 / 1);
  object-fit: cover;
}

/*
  The arrows wear the page's button look, so the theme's variant reaches them: a solid page draws a
  filled arrow, an outline page a hollow one, and the radius is the page's own. They sit half
  transparent over the image so the picture stays the loudest thing in the frame.
*/
.gallery-block__nav {
  display: flex;
  width: 2.25rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: var(--links-theme-button-fg);
  background: var(--links-theme-button-bg);
  border: var(--links-theme-button-border-width, 0) solid var(--links-theme-button-border, transparent);
  border-radius: var(--links-page-radius, 10px);
  cursor: pointer;
  opacity: 0.72;
  transition: opacity 150ms ease;
}
.gallery-block__nav:hover:not(:disabled) {
  opacity: 1;
}
.gallery-block__nav:focus-visible {
  outline: 2px solid var(--links-page-accent);
  outline-offset: 2px;
  opacity: 1;
}
.gallery-block__nav:disabled {
  opacity: 0.35;
  cursor: default;
}
.gallery-block__chevron {
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* A dot per image: the current one stretches into a pill in the page's accent. */
.gallery-block__dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding-top: 0.625rem;
}
.gallery-block__dot {
  width: 0.5rem;
  height: 0.5rem;
  padding: 0;
  background: color-mix(in srgb, var(--links-page-fg) 30%, transparent);
  border: 0;
  border-radius: 9999px;
  cursor: pointer;
  transition:
    width 200ms ease,
    background-color 200ms ease;
}
.gallery-block__dot--current {
  width: 1.25rem;
  background: var(--links-page-accent);
}
.gallery-block__dot:focus-visible {
  outline: 2px solid var(--links-page-accent);
  outline-offset: 2px;
}
</style>
