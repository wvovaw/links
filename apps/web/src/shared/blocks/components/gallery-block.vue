<script setup lang="ts">
import type { BlockProperty, IBlockPropertyList, IBlockPropertyNumber, IBlockPropertySelect } from "@links/blocks";

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

type GalleryRow = { image: string; alt: string; link: string | null };

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

      return [
        {
          image,
          alt: typeof row.alt === "string" ? row.alt : "",
          /*
            The row's link is free text the API never validates, so a `javascript:` value in `href`
            would run in the page's own origin on click: only a web address becomes an anchor.
          */
          link: webHref(row.link),
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
      "--gallery-radius": `${clampNumber((p.radius as IBlockPropertyNumber | undefined)?.value, 0, 32, 10)}px`,
    },
  };
});

/** The carousel's slide. `current` clamps, so deleting the shown row lands on the last one left. */
const index = ref(0);

const current = computed(() => slideOf(index.value));

function slideOf(next: number): number {
  return clampNumber(next, 0, Math.max(bp.value.rows.length - 1, 0), 0);
}

function show(next: number) {
  index.value = slideOf(next);
}
</script>

<template>
  <div class="gallery-block" :class="`gallery-block--${bp.layout}`" :style="bp.style">
    <div class="gallery-block__viewport">
      <div class="gallery-block__track" :style="{ '--gallery-index': current }">
        <component
          :is="row.link ? 'a' : 'div'"
          v-for="(row, index) of bp.rows"
          :key="index"
          class="gallery-block__item"
          :href="row.link || undefined"
          :rel="row.link ? 'noopener noreferrer' : undefined"
        >
          <img class="gallery-block__image" :src="row.image" :alt="row.alt" loading="lazy" />
        </component>
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
      </template>
    </div>
    <div v-if="bp.layout === 'carousel' && bp.rows.length > 1" class="gallery-block__dots">
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
.gallery-block__viewport {
  position: relative;
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
  The carousel shows one image: the track is exactly the viewport's width, the items overflow it at
  one viewport each with no gap, so a step of `-100%` of the track lands on the next image exactly.
  Clipping the viewport also keeps the row of slides from scrolling the page sideways.
*/
.gallery-block--carousel .gallery-block__viewport {
  overflow: hidden;
  overscroll-behavior-x: contain;
}
.gallery-block--carousel .gallery-block__track {
  display: flex;
  transition: transform 250ms ease;
  transform: translateX(calc(var(--gallery-index, 0) * -100%));
}
.gallery-block--carousel .gallery-block__item {
  flex: 0 0 100%;
}

/* The rounding and the crop belong to the item, so the image cannot paint outside it. */
.gallery-block__item {
  display: block;
  line-height: 0;
  overflow: hidden;
  border-radius: var(--gallery-radius, 10px);
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
  filled arrow, an outline page a hollow one, and the radius is the page's own.
*/
.gallery-block__nav {
  position: absolute;
  top: 50%;
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
  transform: translateY(-50%);
  transition: opacity 150ms ease;
}
.gallery-block__nav--prev {
  inset-inline-start: 0.5rem;
}
.gallery-block__nav--next {
  inset-inline-end: 0.5rem;
}
.gallery-block__nav:disabled {
  opacity: 0.4;
  cursor: default;
}
.gallery-block__nav:focus-visible {
  outline: 2px solid var(--links-page-accent);
  outline-offset: 2px;
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
