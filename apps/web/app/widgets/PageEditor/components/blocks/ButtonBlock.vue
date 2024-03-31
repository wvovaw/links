<script setup lang="ts">
import type { IBlockProperty } from "~core/types";

const props = defineProps<{
  properties: Record<string, IBlockProperty>;
}>();

const bp = computed(() => {
  const p = props.properties;
  return {
    text: p.text.value,
    link: p.link.value ?? "#",
    background: p.background.value ? p.background.value : "var(--links-theme-button-bg)",
    foreground: p.foreground.value ? p.foreground.value : "var(--links-theme-button-fg)",
  };
});
</script>

<template>
  <div
    class="button-block-root"
  >
    <template v-if="bp.text">
      {{ bp.text }}
    </template>
    <template v-else>
      &ThinSpace;
    </template>
  </div>
</template>

<style>
.button-block-root {
  color: v-bind('bp.foreground');
  background: v-bind('bp.background');
  width: 100%;
  border-radius: 0.5rem;
  padding: 1rem 0.5rem;
  text-align: center;
  font-weight: 600;
}
</style>
