<script setup lang="ts">
import type { BlockProperty, IBlockPropertyNumber } from "@links/blocks";

import { clampNumber } from "~shared/blocks/clamp-number";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

/* The field offers 0–200, but only the input enforces it, so a stored value is clamped here. */
const height = computed(() =>
  clampNumber((props.properties.height as IBlockPropertyNumber | undefined)?.value, 0, 200, 24),
);
</script>

<template>
  <div class="spacer-block" :style="{ height: `${height}px` }" aria-hidden="true" />
</template>

<style>
.spacer-block {
  width: 100%;
  flex: 0 0 auto;
}
</style>
