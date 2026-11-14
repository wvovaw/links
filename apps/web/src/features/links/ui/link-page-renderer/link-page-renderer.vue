<script setup lang="ts">
import type { IBlock, PageTheme } from "@links/blocks";

import { resolvePageStyle, useBlocksResolver } from "~shared/blocks";
// oxlint-disable-next-line import/no-unassigned-import
import "~shared/blocks/theme.css";

const props = defineProps<{
  blocks: IBlock[];
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
</script>

<template>
  <div class="link" v-bind="linkAttrs">
    <div class="link__container">
      <div class="link__blocks-root">
        <component
          :is="resolve(block.name)"
          v-for="block of blocks"
          :id="`block-${block.id}`"
          :key="block.id"
          :properties="block.properties"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
