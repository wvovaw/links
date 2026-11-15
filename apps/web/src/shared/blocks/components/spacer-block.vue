<script setup lang="ts">
import type { BlockProperty, IBlockPropertyNumber } from "@links/blocks";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const height = computed(() => (props.properties.height as IBlockPropertyNumber | undefined)?.value ?? 24);
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
