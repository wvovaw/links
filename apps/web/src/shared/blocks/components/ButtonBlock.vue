<script setup lang="ts">
import type { BlockProperty, IBlockPropertyText, IBlockPropertyUrl } from "@links/blocks";

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
    border: p.border.value ? p.border.value : "#eee",
  };
});
</script>

<template>
  <a
    :href="bp.link"
    target="_blank"
    class="button-block"
  >
    <div class="button-block__text">
      <template v-if="bp.text">
        {{ bp.text }}
      </template>
      <template v-else>
      &ThinSpace;
      </template>
    </div>
  </a>
</template>

<style>
.button-block {
  color: v-bind('bp.foreground');
  background: v-bind('bp.background');
  font-size: v-bind('bp.fontSize');
  border-color: v-bind('bp.border');
  font-weight: 600;
  width: 100%;
  height: 3.5rem;
  border-radius: 0.5rem;
  padding-inline: 1rem;
  display: flex;
  place-items: center;
  text-align: center;
  user-select: none;
  overflow: hidden;
}
.button-block__text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
</style>
