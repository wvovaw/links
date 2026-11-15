<script setup lang="ts">
import type { BlockProperty, IBlockPropertyColor, IBlockPropertyNumber, IBlockPropertySelect } from "@links/blocks";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const DIVIDER_STYLES = ["line", "dashed", "dotted", "space"] as const;
type DividerStyle = (typeof DIVIDER_STYLES)[number];

/** The style comes from stored data: anything outside the closed set draws the default line. */
function dividerStyle(value: string | undefined): DividerStyle {
  return DIVIDER_STYLES.find((style) => style === value) ?? "line";
}

const bp = computed(() => {
  const p = props.properties;
  const style = dividerStyle((p.style as IBlockPropertySelect | undefined)?.value);
  const color = (p.color as IBlockPropertyColor | undefined)?.value;

  return {
    /* `space` is a gap, not a line: it draws an empty box of the chosen size. */
    space: style === "space",
    style,
    vars: {
      "--divider-spacing": `${(p.spacing as IBlockPropertyNumber | undefined)?.value ?? 16}px`,
      /* A chosen colour is drawn exactly; the theme colour is faded to a line that does not shout. */
      "--divider-color": color || "var(--links-page-fg)",
      "--divider-opacity": color ? "1" : "0.25",
    },
  };
});
</script>

<template>
  <div v-if="bp.space" class="divider-block divider-block--space" :style="bp.vars" />
  <hr v-else class="divider-block" :class="`divider-block--${bp.style}`" :style="bp.vars" />
</template>

<style>
.divider-block {
  width: 100%;
  margin: 0;
  /* Preflight zeroes every border, so the line needs all three parts back. */
  border: 0;
  border-top-width: 1px;
  border-top-color: var(--divider-color, var(--links-page-fg));
  opacity: var(--divider-opacity, 0.25);
}
.divider-block--line {
  border-top-style: solid;
}
.divider-block--dashed {
  border-top-style: dashed;
}
.divider-block--dotted {
  border-top-style: dotted;
}
hr.divider-block {
  margin-block: var(--divider-spacing, 16px);
}
.divider-block--space {
  height: var(--divider-spacing, 16px);
}
</style>
