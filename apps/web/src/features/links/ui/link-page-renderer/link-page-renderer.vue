<script setup lang="ts">
import type { IBlock, PageTheme } from "@links/blocks";

import { resolvePageStyle, trackBlockEvent, trackPageView, useBlocksResolver, visibleBlocks } from "~shared/blocks";
// oxlint-disable-next-line import/no-unassigned-import
import "~shared/blocks/theme.css";

const props = defineProps<{
  blocks: IBlock[];
  /**
   * The request's one clock, so this filter and the payload filter agree on a boundary. It is idempotent
   * on an already-filtered list: a block the page dropped is not here to be dropped again.
   */
  now: Date;
  theme?: PageTheme | null;
  background?: string | null;
  /**
   * The page this renderer is serving. Absent where the same component draws a preview: a page its owner
   * is still editing must not report clicks as if a visitor made them.
   */
  slug?: string;
}>();

const { resolve } = useBlocksResolver();
const config = useRuntimeConfig();

/**
 * Passing neither prop means the caller owns the page background (it styles an element around this
 * one, so the footer sits on it too); an explicitly passed `null` still asks for the default style.
 * Without a style the element gets no `style` attribute at all, as it had before themes existed.
 */
const linkAttrs = computed(() =>
  props.theme === undefined && props.background === undefined
    ? {}
    : { style: resolvePageStyle(props.theme ?? null, props.background ?? null) },
);

/**
 * A block its schedule hides is dropped before rendering rather than hidden with CSS: the served HTML
 * carries neither the hidden block's text nor its markup, so nothing leaks to a visitor who views the
 * source or reads the page without styles.
 */
const shownBlocks = computed(() => visibleBlocks(props.blocks, props.now));

/**
 * One visit per document, reported once the page is in front of a visitor. `onMounted` is client-only, so
 * server rendering never counts a request a browser has not run, and the `slug` guard is the same one the
 * click listener uses: the constructor and the preview draw this component too, and neither is a visitor.
 */
onMounted(() => {
  if (props.slug) trackPageView({ slug: props.slug, origin: config.public.backendUrl });
});

/**
 * One listener for the whole page rather than one per block, and no inline handler on any of them: a
 * click is attributed to the nearest block wrapper it came from, and a click that lands between blocks
 * reports nothing.
 */
function reportClick(event: MouseEvent) {
  if (!props.slug) return;

  const target = event.target instanceof Element ? event.target.closest("[data-block-id]") : null;
  const blockId = target?.getAttribute("data-block-id");
  if (!blockId) return;

  trackBlockEvent({ slug: props.slug, blockId, kind: "click", origin: config.public.backendUrl });
}
</script>

<template>
  <div class="link" v-bind="linkAttrs">
    <div class="link__container">
      <div class="link__blocks-root" @click="reportClick">
        <div v-for="block of shownBlocks" :key="block.id" :data-block-id="block.id">
          <component
            :is="resolve(block.name)"
            :id="`block-${block.id}`"
            :block-id="block.id"
            :properties="block.properties"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
