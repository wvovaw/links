<script setup lang="ts">
import type { BlockProperty, IBlockPropertyBoolean, IBlockPropertyList, IBlockPropertySelect } from "@links/blocks";

import { completeRows } from "@links/blocks";
import { resolveBlockImageUrl } from "~shared/blocks";
import { clampNumber } from "~shared/blocks/clamp-number";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const config = useRuntimeConfig();

const LAYOUTS = ["list", "grid"] as const;
type TestimonialsLayout = (typeof LAYOUTS)[number];

/** The row is drawn from five stars, whatever a stored row claims about its rating. */
const MAX_RATING = 5;

/** The layout comes from stored data: anything outside the closed set draws the list. */
function layoutOf(value: string | undefined): TestimonialsLayout {
  return LAYOUTS.find((layout) => layout === value) ?? "list";
}

/**
 * The field offers 1–5 with a step of one, and a stored row is unvalidated JSON: a rating may arrive as
 * a numeric string — a cleared editor input round-trips through one — so it is read as a number first.
 * `clampNumber` keeps it inside the five stars and rounding keeps a fraction from drawing part of a
 * star, while an unreadable value draws no stars, which is what `0` means here.
 */
function starCount(value: unknown): number {
  const rating = typeof value === "string" ? Number(value.trim()) : value;

  return Math.round(clampNumber(rating, 0, MAX_RATING, 0));
}

/**
 * A row is unvalidated stored JSON, and `completeRows` only asks that a required key holds something:
 * a numeric quote would pass it and then draw an empty `blockquote`, so every text is read as text or
 * as blank.
 */
function rowText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

type TestimonialRow = { quote: string; author: string; role: string; avatar: string | undefined; stars: number };

const bp = computed(() => {
  const p = props.properties;

  return {
    layout: layoutOf((p.layout as IBlockPropertySelect | undefined)?.value),
    showRating: (p["show-rating"] as IBlockPropertyBoolean | undefined)?.value === true,
    rows: completeRows(p.items as IBlockPropertyList | undefined).flatMap((row): TestimonialRow[] => {
      const quote = rowText(row.quote);
      /* A testimonial without the words is not one, whatever else the row holds. */
      if (!quote) return [];

      return [
        {
          quote,
          author: rowText(row.author),
          role: rowText(row.role),
          /* `rowText` also turns a whitespace-only avatar into blank, so it never reaches the storage url. */
          avatar: resolveBlockImageUrl(rowText(row.avatar), { origin: config.public.backendUrl }),
          stars: starCount(row.rating),
        },
      ];
    }),
  };
});
</script>

<template>
  <div class="testimonials-block" :class="`testimonials-block--${bp.layout}`">
    <blockquote v-for="(row, index) of bp.rows" :key="index" class="testimonials-block__item">
      <p class="testimonials-block__quote">{{ row.quote }}</p>
      <!-- The stars are one picture, so the group names the number instead of five empty icons. -->
      <span
        v-if="bp.showRating && row.stars"
        class="testimonials-block__rating"
        role="img"
        :aria-label="`${row.stars} / ${MAX_RATING}`"
      >
        <span
          v-for="star in MAX_RATING"
          :key="star"
          class="i-lucide:star testimonials-block__star"
          :class="{ 'testimonials-block__star--on': star <= row.stars }"
        />
      </span>
      <cite v-if="row.avatar || row.author || row.role" class="testimonials-block__cite">
        <img v-if="row.avatar" class="testimonials-block__avatar" :src="row.avatar" alt="" loading="lazy" />
        <span class="testimonials-block__attribution">
          <span v-if="row.author" class="testimonials-block__author">{{ row.author }}</span>
          <span v-if="row.role" class="testimonials-block__role">{{ row.role }}</span>
        </span>
      </cite>
    </blockquote>
  </div>
</template>

<style>
/*
  A block with nothing to draw still measures one line, so the constructor keeps a box to select; the
  public page shows the same empty box, which is invisible.
*/
.testimonials-block {
  width: 100%;
  min-height: 2rem;
  color: var(--links-page-fg);
}
.testimonials-block--list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
/*
  `minmax(0, …)` rather than `1fr`: a long quote would otherwise widen a track past the page and scroll
  the whole page sideways.
*/
.testimonials-block--grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}
/*
  Two quotes side by side need width to read: the page container is 640px wide at most, and at 320px a
  half is narrower than the words in it. A phone therefore gets one quote per row.
*/
@media (max-width: 639px) {
  .testimonials-block--grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
/* The quote is a surface of its own, so praise reads as one voice among the page's blocks. */
.testimonials-block__item {
  margin: 0;
  padding: 0.75rem;
  border-radius: var(--links-page-radius, 10px);
  background: color-mix(in srgb, var(--links-page-fg) 6%, transparent);
}
/* `min-width: 0` lets a long word wrap inside the card instead of pushing the card wider. */
.testimonials-block__quote {
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
  /* A quote typed over several lines keeps those lines on the page. */
  white-space: pre-line;
}
.testimonials-block__rating {
  display: inline-flex;
  align-items: center;
  gap: 0.1rem;
  margin-block-start: 0.4rem;
  /* The colour sits on the group: an icon class carries `color: inherit` of its own. */
  color: var(--links-page-accent);
}
/* Every one of the five marks a place; only the stars the row reaches are drawn at full strength. */
.testimonials-block__star {
  font-size: 0.95rem;
  opacity: 0.3;
}
.testimonials-block__star--on {
  opacity: 1;
}
/* A quote's source reads as one line: the portrait beside the name, the role under it. */
.testimonials-block__cite {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-block-start: 0.6rem;
  font-style: normal;
}
.testimonials-block__avatar {
  flex: 0 0 auto;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}
.testimonials-block__attribution {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.25;
}
.testimonials-block__author {
  font-size: 0.875rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.testimonials-block__role {
  font-size: 0.75rem;
  opacity: 0.7;
  overflow-wrap: anywhere;
}
</style>
