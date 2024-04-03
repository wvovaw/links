<script setup lang="ts">
import type { BlockProperty, IBlockPropertyText, IBlockPropertyUrl } from "~core/types";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const bp = computed(() => {
  const p = props.properties;
  return {
    text: (p.text as IBlockPropertyText).value,
    link: p.link.value ? (p.link as IBlockPropertyUrl).value : "#",
    background: p.background.value ? p.background.value : "var(--links-theme-button-bg)",
    foreground: p.foreground.value ? p.foreground.value : "var(--links-theme-button-fg)",
    fontSize: p["font-size"].value ? p["font-size"].value : "var(--links-theme-button-font-size)",
    adultConfirmation: p["adult-confirmation"].value ? p["adult-confirmation"].value : false,
  };
});
</script>

<template>
  <a
    :href="bp.link"
    target="_blank"
    class="button-block-root"
  >
    <template v-if="bp.text">
      {{ bp.text }}
    </template>
    <template v-else>
      &ThinSpace;
    </template>
  </a>
</template>

<style>
.button-block-root {
  color: v-bind('bp.foreground');
  background: v-bind('bp.background');
  font-size: v-bind('bp.fontSize');
  width: 100%;
  border-radius: 0.5rem;
  padding: 1rem 0.5rem;
  text-align: center;
  font-weight: 600;
  user-select: none;
}
</style>
