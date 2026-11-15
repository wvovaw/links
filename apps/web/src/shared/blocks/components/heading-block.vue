<script setup lang="ts">
import type { BlockProperty, IBlockPropertySelect, IBlockPropertyText } from "@links/blocks";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const HEADING_TAGS = ["h1", "h2", "h3"] as const;
type HeadingTag = (typeof HEADING_TAGS)[number];

/**
 * The tag comes from stored data, so it is matched against the closed set: `<component :is>` resolves
 * any other string as a component name. A heading stored before the property existed is the h2.
 */
function headingTag(value: string | undefined): HeadingTag {
  return HEADING_TAGS.find((tag) => tag === value) ?? "h2";
}

const bp = computed(() => {
  const p = props.properties;
  return {
    text: (p.text as IBlockPropertyText | undefined)?.value,
    tag: headingTag((p.level as IBlockPropertySelect | undefined)?.value),
    style: {
      "--heading-align": (p.align as IBlockPropertySelect | undefined)?.value ?? "center",
    },
  };
});
</script>

<template>
  <div class="heading-block" :style="bp.style">
    <component :is="bp.tag" v-if="bp.text" class="heading-block__text">{{ bp.text }}</component>
  </div>
</template>

<style>
/* The box stays as tall as one line without text, so an empty heading is still selectable. */
.heading-block {
  width: 100%;
  min-height: 2rem;
  text-align: var(--heading-align, center);
}
.heading-block__text {
  color: var(--links-page-fg);
  font-weight: 700;
  line-height: 1.25;
  text-wrap: balance;
  overflow-wrap: anywhere;
}
/* Preflight zeroes heading sizes, so each level carries its own. */
h1.heading-block__text {
  font-size: 2rem;
}
h2.heading-block__text {
  font-size: 1.5rem;
}
h3.heading-block__text {
  font-size: 1.25rem;
}
</style>
