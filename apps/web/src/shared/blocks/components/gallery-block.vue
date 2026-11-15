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

const LAYOUTS = ["grid", "strip"] as const;
type GalleryLayout = (typeof LAYOUTS)[number];

/** The shape comes from stored data: anything outside the closed set draws a square. */
const ASPECTS = { "1:1": "1 / 1", "4:3": "4 / 3", "16:9": "16 / 9" } as const;

function layoutOf(value: string | undefined): GalleryLayout {
  return LAYOUTS.find((layout) => layout === value) ?? "grid";
}

function aspectOf(value: string | undefined): string {
  return value === "4:3" || value === "16:9" ? ASPECTS[value] : ASPECTS["1:1"];
}

/**
 * `repeat()` takes a whole number of tracks while the field stores text, so the value is parsed and
 * clamped here: the field offers 2, 3 and 4, and a stored `"9"`, `"many"` or `""` still draws a grid.
 */
function columnCount(value: string | undefined): number {
  return Math.round(clampNumber(Number(value), 2, 4, 2));
}

type GalleryRow = { image: string; alt: string; link: string | null };

const bp = computed(() => {
  const p = props.properties;

  return {
    layout: layoutOf((p.layout as IBlockPropertySelect | undefined)?.value),
    /*
      A row with no image has nothing to draw, and neither has one whose image is not a string: the
      stored block is unvalidated JSON, so `image: 42` is a row `completeRows` keeps and
      `resolveBlockImageUrl` has no url for. Both are dropped rather than painted as a broken image.
    */
    rows: completeRows(p.items as IBlockPropertyList | undefined, ["image"]).flatMap((row): GalleryRow[] => {
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
      "--gallery-columns": `${columnCount((p.columns as IBlockPropertySelect | undefined)?.value)}`,
      "--gallery-aspect": aspectOf((p.aspect as IBlockPropertySelect | undefined)?.value),
      "--gallery-radius": `${clampNumber((p.radius as IBlockPropertyNumber | undefined)?.value, 0, 32, 10)}px`,
    },
  };
});
</script>

<template>
  <div class="gallery-block" :class="`gallery-block--${bp.layout}`" :style="bp.style">
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
.gallery-block--grid {
  display: grid;
  grid-template-columns: repeat(var(--gallery-columns, 2), 1fr);
  gap: 0.5rem;
}
/*
  The same cap as a product card, for the same reason: the owner picks 2–4 tracks, but the page
  container is 640px wide at most, and below that four images at 320px leave 66px each. A phone keeps
  the two tracks the strip layout already fits there; a wider screen draws the stored count.
*/
@media (max-width: 639px) {
  .gallery-block--grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
/*
  The strip scrolls on its own: capping the width and containing the scroll keeps a sideways swipe from
  reaching the page behind it, so a gallery never makes the page scroll horizontally.
*/
.gallery-block--strip {
  display: flex;
  gap: 0.5rem;
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
}
.gallery-block--strip .gallery-block__item {
  /* Two images fit at a time, so the next one peeks in and the strip reads as scrollable. */
  flex: 0 0 calc((100% - 0.5rem) / 2);
  scroll-snap-align: start;
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
</style>
