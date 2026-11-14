<script setup lang="ts">
import type {
  BlockProperty,
  IBlockPropertyBoolean,
  IBlockPropertyColor,
  IBlockPropertySelect,
  IBlockPropertyText,
  IBlockPropertyUrl,
} from "@links/blocks";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const bp = computed(() => {
  const p = props.properties;
  const foreground = (p.foreground as IBlockPropertyColor | undefined)?.value;
  const background = (p.background as IBlockPropertyColor | undefined)?.value;
  const fontSize = (p["font-size"] as IBlockPropertySelect | undefined)?.value;
  const border = (p.border as IBlockPropertyColor | undefined)?.value;

  return {
    text: (p.text! as IBlockPropertyText).value,
    link: p.link!.value ? (p.link as IBlockPropertyUrl).value : "#",
    /* Buttons stored before the switch existed always opened in a new tab. */
    newTab: (p["new-tab"] as IBlockPropertyBoolean | undefined)?.value ?? true,
    style: {
      "--button-fg": foreground || "var(--links-theme-button-fg)",
      "--button-bg": background || "var(--links-theme-button-bg)",
      "--button-font-size": fontSize || "var(--links-theme-button-font-size-md)",
      "--button-border": border || "#eee",
    },
  };
});
</script>

<template>
  <a
    :href="bp.link"
    :target="bp.newTab ? '_blank' : undefined"
    :rel="bp.newTab ? 'noopener noreferrer' : undefined"
    class="button-block"
    :style="bp.style"
  >
    <div class="button-block__text">
      <template v-if="bp.text">
        {{ bp.text }}
      </template>
      <template v-else> &ThinSpace; </template>
    </div>
  </a>
</template>

<style>
.button-block {
  color: var(--button-fg, var(--links-theme-button-fg));
  background: var(--button-bg, var(--links-theme-button-bg));
  font-size: var(--button-font-size, var(--links-theme-button-font-size-md));
  border-color: var(--button-border, #eee);
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
