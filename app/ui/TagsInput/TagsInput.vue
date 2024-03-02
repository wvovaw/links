<script setup lang="ts">
import { type HTMLAttributes, computed, provide } from "vue";
import { TagsInputRoot, type TagsInputRootEmits, type TagsInputRootProps, useForwardPropsEmits } from "radix-vue";
import type { VariantProps } from "cva";
import { cva } from "cva";

const tagsInputRootVariants = cva("flex flex-wrap gap-2 items-center justify-start bg-goku", {
  variants: {
    color: { piccolo: "ti-piccolo", hit: "ti-hit" },
    size: { sm: "rounded-moon-i-xs px-2 py-1", md: " rounded-moon-i-sm px-3 py-2", lg: "rounded-moon-i-sm px-3 py-3" },
    fullWidth: { true: "w-full", false: "" },
  },
  defaultVariants: {
    color: "piccolo",
    size: "md",
  },
});
type TagsInputRootVariants = VariantProps<typeof tagsInputRootVariants>;

const props = defineProps<TagsInputRootProps & {
  class?: HTMLAttributes["class"];
  color?: TagsInputRootVariants["color"];
  size?: TagsInputRootVariants["size"];
  fullWidth?: boolean;
}>();
const emits = defineEmits<TagsInputRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, color: _co, size: _si, fullWidth: _fw, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);

provide("tagsInput", {
  size: props.size,
  color: props.color,
});
</script>

<template>
  <TagsInputRoot v-bind="forwarded" class="root" :class="[tagsInputRootVariants({ color, size, fullWidth }), props.class]" tabindex="-1">
    <slot />
  </TagsInputRoot>
</template>

<style scoped>
.root {
  box-shadow: inset 0 0 0 1px var(--beerus);
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration:150ms;
  background: var(--goku);
  color: var(--bulma);
  padding-left: 1rem;
  padding-right: 1rem;
  margin: 0;
}
.root:hover {
  box-shadow: inset 0 0 0 var(--border-i-width) var(--trunks), inset 0 0 0 var(--border-i-width) var(--beerus);
}
/* Colors */
.root.ti-piccolo:focus,
.root.ti-piccolo:focus-visible,
.root.ti-piccolo:focus-within {
  outline: none;
  box-shadow: 0 0 0 var(--border-i-width) var(--piccolo) inset;
}
.root.ti-hit:focus,
.root.ti-hit:focus-visible,
.root.ti-hit:focus-within {
  outline: none;
  box-shadow: 0 0 0 var(--border-i-width) var(--hit) inset;
}
</style>
