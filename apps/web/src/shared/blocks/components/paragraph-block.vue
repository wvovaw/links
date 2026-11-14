<script setup lang="ts">
import type { BlockProperty, IBlockPropertySelect } from "@links/blocks";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const bp = computed(() => {
  const p = props.properties;
  return {
    text: p.text!.value,
    /* Every fallback here is the value a paragraph rendered with before the property existed. */
    style: {
      "--paragraph-align": (p.align as IBlockPropertySelect | undefined)?.value ?? "center",
      "--paragraph-font-size":
        (p["font-size"] as IBlockPropertySelect | undefined)?.value ?? "var(--links-theme-paragraph-font-size-md)",
      "--paragraph-inline-padding": p["inline-padding"]!.value
        ? `${p["inline-padding"]!.value}px`
        : "var(--links-theme-paragraph-inline-padding)",
    },
  };
});
</script>

<template>
  <div class="paragraph-block" :style="bp.style">
    <p class="paragraph-block__text" v-text="bp.text" />
  </div>
</template>

<style>
.paragraph-block {
  min-height: 2rem;
  width: 100%;
}
.paragraph-block__text {
  text-align: var(--paragraph-align, center);
  font-size: var(--paragraph-font-size, var(--links-theme-paragraph-font-size-md));
  padding-inline: var(--paragraph-inline-padding, var(--links-theme-paragraph-inline-padding));
  color: var(--links-theme-paragraph-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: balance;
}
</style>
