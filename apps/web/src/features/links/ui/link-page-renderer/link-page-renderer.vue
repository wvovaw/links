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

const pageStyle = computed(() => resolvePageStyle(props.theme ?? null, props.background ?? null));
</script>

<template>
  <div class="link" :style="pageStyle">
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
