<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { ToggleGroupRoot, type ToggleGroupRootEmits, type ToggleGroupRootProps, useForwardPropsEmits } from "radix-vue";
import { type VariantProps, cva } from "cva";

/*
* FIXME: Try to fix it after UI moved to separate package of a monorepo
* This variant partially mirrors ToggleItem.vue variants to make it possible to set variants, size etc in a provider (here).
* So this should be moved into a separate file and imported from it, but this won't work for now because of Unocss errors when extracting utilities from .ts is on.
*/
const toggleVariants = cva("", {
  variants: {
    variant: { default: "", ghost: "" },
    color: { piccolo: "", hit: "", roshi: "", chichi: "", krillin: "" },
    withStroke: { true: "", false: "" },
    size: { sm: "", md: "" },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    color: "piccolo",
    withStroke: false,
  },
});
type ToggleGroupVariants = VariantProps<typeof toggleVariants>;

const props = withDefaults(defineProps<ToggleGroupRootProps & {
  class?: HTMLAttributes["class"];
  variant?: ToggleGroupVariants["variant"];
  color?: ToggleGroupVariants["color"];
  withStroke?: Extract<ToggleGroupVariants["withStroke"], boolean>;
  size?: ToggleGroupVariants["size"];
}>(), {
  type: "single",
});

const emits = defineEmits<ToggleGroupRootEmits>();

provide("toggleGroup", {
  variant: props.variant,
  color: props.color,
  withStroke: props.withStroke,
  size: props.size,
  disabled: props.disabled,
});

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <ToggleGroupRoot v-bind="forwarded" class="flex items-center justify-center gap-1" :class="props.class">
    <slot />
  </ToggleGroupRoot>
</template>
