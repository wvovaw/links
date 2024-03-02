<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import type { ProgressRootProps } from "radix-vue";
import { ProgressIndicator, ProgressRoot } from "radix-vue";
import { type VariantProps, cva } from "cva";

const progressRootVariants = cva("", {
  variants: {
    size: { xs: "w-4 h-4", sm: "w-6 h-6", md: "w-8 h-8", lg: "w-10 h-10", xl: "w-12 h-12" },
  },
  defaultVariants: {
    size: "lg",
  },
});
const progressIndicatorVariants = cva("", {
  variants: {
    color: { piccolo: "stroke-piccolo ", hit: "stroke-hit ", roshi: "stroke-roshi", chichi: "stroke-chichi", krillin: "stroke-krillin" },
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
  max: 100,
});

const delegatedProps = computed(() => {
  const { class: _, color: _co, size: _si, ...delegated } = props;
  return delegated;
});

const rad = 46.46;
const sdo = computed(() => {
  if (!props.modelValue || props.modelValue === 0)
    return 289.027;
  else
    return ((props.max - props.modelValue!) / 100) * Math.PI * (rad * 2);
});
</script>

<template>
  <ProgressRoot
    :class="[progressRootVariants({ size }), props.class]"
    v-bind="delegatedProps"
    as-child
  >
    <svg viewBox="0 0 100 100">
      <path
        stroke-linecap="round" d="M 50,50 m 0,-46 a 46,46 0 1 1 0,92 a 46,46 0 1 1 0,-92"
        class="background stroke-[0.5rem] stroke-progress"
        style="stroke-dasharray: 289.027px, 289.027px; stroke-dashoffset: 0px; fill-opacity: 0;"
      />
      <ProgressIndicator
        as-child
      >
        <path
          stroke-linecap="round" d="M 50,50 m 0,-46 a 46,46 0 1 1 0,92 a 46,46 0 1 1 0,-92"
          class="progress stroke-[0.5rem] rtl:-scale-x-100 rtl:translate-x-full transition-[stroke-dashoffset] duration-500 ease-in-out"
          :class="progressIndicatorVariants({ color })"
          :style="{ 'stroke-dasharray': '289.027px, 289.027px', 'fill-opacity': '0', 'stroke-dashoffset': sdo }"
        />
      </ProgressIndicator>
    </svg>
  </ProgressRoot>
</template>

<style scoped>
svg[data-state="indeterminate"]:not([data-value="0"]) {
  animation: progress-indeterminate 2s linear infinite;
}
path[data-state="indeterminate"]:not([data-value="0"]) {
  animation: progress-bar-indeterminate 2s ease-in-out infinite;
}
@keyframes progress-indeterminate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes progress-bar-indeterminate {
  0% {
    stroke-dasharray: 1,289.027;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 289.027,289.027;
    stroke-dashoffset: -65px;
  }
  100% {
    stroke-dasharray: 289.027,289.027;
    stroke-dashoffset: -289.027px;
  }
}
</style>
