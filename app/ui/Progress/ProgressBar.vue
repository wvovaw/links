<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import type { ProgressRootProps } from "radix-vue";
import { ProgressIndicator, ProgressRoot } from "radix-vue";
import { type VariantProps, cva } from "cva";

const progressRootVariants = cva("relative overflow-hidden w-full rounded-full bg-beerus", {
  variants: {
    size: { xs: "h-0.5", sm: "h-1", md: "h-2", lg: "h-3", xl: "h-4" },
  },
  defaultVariants: {
    size: "lg",
  },
});
const progressIndicatorVariants = cva("h-full w-full flex-1 rounded-full transition-all", {
  variants: {
    color: { piccolo: "bg-piccolo ", hit: "bg-hit ", roshi: "bg-roshi", chichi: "bg-chichi", krillin: "bg-krillin" },
  },
  defaultVariants: {
    color: "piccolo",
  },

});
type ProgressRootVariants = VariantProps<typeof progressRootVariants>;
type ProgressIndicatorVariants = VariantProps<typeof progressIndicatorVariants>;

const props = withDefaults(defineProps<ProgressRootProps & {
  class?: HTMLAttributes["class"];
  size?: ProgressRootVariants["size"];
  color?: ProgressIndicatorVariants["color"];
}>(), {
  modelValue: 0,
  max: 100,
});

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <ProgressRoot
    :class="[progressRootVariants({ size }), props.class]"
    v-bind="delegatedProps"
  >
    <ProgressIndicator
      :class="progressIndicatorVariants({ color })"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
    />
  </ProgressRoot>
</template>
