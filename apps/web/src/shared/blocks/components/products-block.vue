<script setup lang="ts">
import type {
  BlockProperty,
  IBlockPropertyBoolean,
  IBlockPropertyList,
  IBlockPropertySelect,
  IBlockPropertyText,
} from "@links/blocks";

import { completeRows } from "@links/blocks";
import { resolveBlockImageUrl } from "~shared/blocks";
import { clampNumber } from "~shared/blocks/clamp-number";
import { webHref } from "~shared/blocks/link-url";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const config = useRuntimeConfig();

const LAYOUTS = ["list", "grid"] as const;
type ProductsLayout = (typeof LAYOUTS)[number];

const DEFAULT_CTA_LABEL = "Buy";

/** The layout comes from stored data: anything outside the closed set draws the list. */
function layoutOf(value: string | undefined): ProductsLayout {
  return LAYOUTS.find((layout) => layout === value) ?? "list";
}

/**
 * `repeat()` takes a whole number of tracks while the field stores text, so the value is parsed and
 * clamped here: the field offers 2 and 3, and a stored `"9"`, `"many"` or `""` still draws a grid.
 */
function columnCount(value: string | undefined): number {
  return Math.round(clampNumber(Number(value), 2, 3, 2));
}

/**
 * A row is unvalidated stored JSON, and `completeRows` only asks that a required key holds something:
 * a numeric name would pass it and then draw an empty card, so every text is read as text or as blank.
 */
function rowText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

type ProductRow = { image: string | undefined; title: string; subtitle: string; price: string; href: string | null };

const bp = computed(() => {
  const p = props.properties;

  return {
    layout: layoutOf((p.layout as IBlockPropertySelect | undefined)?.value),
    rows: completeRows(p.items as IBlockPropertyList | undefined, ["title", "url"]).flatMap((row): ProductRow[] => {
      const title = rowText(row.title);
      /* A card with no name sells nothing, whatever else the row holds. */
      if (!title) return [];

      return [
        {
          image:
            typeof row.image === "string"
              ? resolveBlockImageUrl(row.image, { origin: config.public.backendUrl })
              : undefined,
          title,
          subtitle: rowText(row.subtitle),
          price: rowText(row.price),
          /*
            The row's link points at somebody else's checkout, and the API never validates it: a
            `javascript:` value in `href` would run in the page's own origin on click. Such a row keeps
            its card and loses only the button, the way a gallery keeps its image and drops the link.
          */
          href: webHref(row.url),
        },
      ];
    }),
    showPrice: (p["show-price"] as IBlockPropertyBoolean | undefined)?.value !== false,
    ctaLabel: rowText((p["cta-label"] as IBlockPropertyText | undefined)?.value) || DEFAULT_CTA_LABEL,
    disclaimer: rowText((p.disclaimer as IBlockPropertyText | undefined)?.value),
    style: { "--products-columns": `${columnCount((p.columns as IBlockPropertySelect | undefined)?.value)}` },
  };
});
</script>

<template>
  <div class="products-block" :class="`products-block--${bp.layout}`" :style="bp.style">
    <ul class="products-block__list">
      <li v-for="(row, index) of bp.rows" :key="index" class="products-block__item">
        <!-- The name beside the picture already says what it shows, so the image stays decorative. -->
        <img v-if="row.image" class="products-block__image" :src="row.image" alt="" loading="lazy" />
        <div class="products-block__body">
          <p class="products-block__title">{{ row.title }}</p>
          <p v-if="row.subtitle" class="products-block__subtitle">{{ row.subtitle }}</p>
          <div v-if="(bp.showPrice && row.price) || row.href" class="products-block__footer">
            <p v-if="bp.showPrice && row.price" class="products-block__price">{{ row.price }}</p>
            <!-- A screen reader lists the buttons on their own, so each one names its own product. -->
            <a
              v-if="row.href"
              class="products-block__cta"
              :href="row.href"
              :aria-label="`${bp.ctaLabel}: ${row.title}`"
              target="_blank"
              rel="noopener noreferrer"
              >{{ bp.ctaLabel }}</a
            >
          </div>
        </div>
      </li>
    </ul>
    <p v-if="bp.disclaimer" class="products-block__disclaimer">{{ bp.disclaimer }}</p>
  </div>
</template>

<style>
/*
  A block with nothing to draw still measures one line, so the constructor keeps a box to select; the
  public page shows the same empty box, which is invisible.
*/
.products-block {
  width: 100%;
  min-height: 2rem;
  color: var(--links-page-fg);
}
.products-block__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
/*
  `minmax(0, …)` rather than `1fr`: a long price or a Cyrillic name would otherwise widen the track
  past the page, and the card would scroll the whole page sideways on a narrow screen.
*/
.products-block--grid .products-block__list {
  display: grid;
  grid-template-columns: repeat(var(--products-columns, 2), minmax(0, 1fr));
}
/*
  The column count is the owner's setting, so it is drawn only where a column can hold a card: the page
  container is 640px wide at most, and once it narrows with the viewport three cards came out 88px wide
  at 320px — no horizontal scroll, just unreadable cards. A phone therefore gets one column, and an
  explicit breakpoint rather than `auto-fit`: the count is a setting and must not drift on a wide screen.
*/
@media (max-width: 639px) {
  .products-block--grid .products-block__list {
    grid-template-columns: minmax(0, 1fr);
  }
}
/* The card is a surface of its own, so a product reads as one item among the page's blocks. */
.products-block__item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--links-page-radius, 10px);
  background: color-mix(in srgb, var(--links-page-fg) 6%, transparent);
}
.products-block--grid .products-block__item {
  flex-direction: column;
}
/* The thumbnail is a fixed square in a list and the card's top edge in a grid. */
.products-block__image {
  flex: 0 0 auto;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: calc(var(--links-page-radius, 10px) * 0.6);
  object-fit: cover;
}
.products-block--grid .products-block__image {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
}
/* `min-width: 0` lets a long word wrap inside the card instead of pushing the card wider. */
.products-block__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}
.products-block__title {
  margin: 0;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.products-block__subtitle {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.75;
  overflow-wrap: anywhere;
}
/* Pinned to the card's bottom edge, so buttons line up across a grid of unequal descriptions. */
.products-block__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-block-start: auto;
  padding-block-start: 0.35rem;
}
.products-block__price {
  margin: 0;
  font-weight: 700;
  overflow-wrap: anywhere;
}
.products-block__cta {
  padding: 0.4rem 0.9rem;
  border-radius: var(--links-page-radius, 10px);
  background: var(--links-page-accent);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  overflow-wrap: anywhere;
}
.products-block__disclaimer {
  margin: 0.75rem 0 0;
  font-size: 0.75rem;
  opacity: 0.7;
  white-space: pre-line;
  overflow-wrap: anywhere;
}
</style>
