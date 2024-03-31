<script setup lang="ts">
import type { IBlockProperty } from "~core/types";

const props = defineProps<{
  properties: Record<string, IBlockProperty>;
}>();

const bp = computed(() => {
  const p = props.properties;
  return {
    text: p.text.value,
  };
});
</script>

<template>
  <p
    class="paragraph-block-root"
  >
    {{ bp.text }}
  </p>
</template>

<style>
.paragraph-block-root {
  min-height: 2rem;
  width: 100%;
  text-align: center;
}
</style>