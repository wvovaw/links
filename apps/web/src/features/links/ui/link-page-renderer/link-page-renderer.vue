<script setup lang="ts">
import type { IBlock } from "@links/blocks";
import { useBlocksResolver } from "~shared/blocks";
import "~shared/blocks/theme.css";

defineProps<{
  blocks: IBlock[];
  backgroundCss?: string;
}>();

const { resolve } = useBlocksResolver();
</script>

<template>
  <div class="link" :style="backgroundCss">
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

<style scoped>
</style>
