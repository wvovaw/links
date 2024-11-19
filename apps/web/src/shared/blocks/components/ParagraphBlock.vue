<script setup lang="ts">
import type { BlockProperty } from "@links/blocks";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const bp = computed(() => {
  const p = props.properties;
  return {
    text: p.text.value,
    marginX: p["inline-padding"].value ? `${p["inline-padding"].value}px` : "var(--links-theme-paragraph-inline-padding)",
  };
});
</script>

<template>
  <div class="paragraph-block">
    <p class="paragraph-block__text" v-text="bp.text" />
  </div>
</template>

<style>
.paragraph-block {
  min-height: 2rem;
  width: 100%;
}
.paragraph-block__text {
  text-align: center;
  padding-inline: v-bind('bp.marginX');
  color: var(--links-theme-paragraph-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: balance;
}
</style>
