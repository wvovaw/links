<script setup lang="ts">
import type { IBlock, PageTheme } from "@links/blocks";

import { resolvePageStyle, useBlocksResolver, visibleBlocks } from "~shared/blocks";
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
}>();

const { resolve } = useBlocksResolver();

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
</script>

<template>
  <div class="link" v-bind="linkAttrs">
    <div class="link__container">
      <div class="link__blocks-root">
        <component
          :is="resolve(block.name)"
          v-for="block of shownBlocks"
          :id="`block-${block.id}`"
          :key="block.id"
          :properties="block.properties"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
