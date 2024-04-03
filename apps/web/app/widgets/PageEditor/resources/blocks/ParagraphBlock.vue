<script setup lang="ts">
import type { BlockProperty } from "~core/types";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const bp = computed(() => {
  const p = props.properties;
  return {
    text: p.text.value,
    marginX: p["inline-padding"].value ? `${p["inline-padding"].value}px` : "var(--links-theme-paragraph-inline-padding)",
    flag: p.flag.value ? p.flag.value : false
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
  padding-inline: v-bind('bp.marginX');
  color: var(--links-theme-paragraph-fg);
}
</style>
