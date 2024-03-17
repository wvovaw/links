<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { SelectIcon, SelectTrigger, type SelectTriggerProps, useForwardProps } from "radix-vue";
import { type VariantProps, cva } from "cva";

const selectTriggerVariants = cva("select-none relative flex items-center justify-between gap-2 w-full bg-goku border border-beerus transition-shadow duration-200 focus:outline-none", {
  variants: {
    color: { piccolo: "rs-piccolo", hit: "rs-hit" },
    size: { sm: "h-8 py-1 px-2 rounded-moon-i-xs", md: "h-10 py-2 px-3 rounded-moon-i-sm", lg: "h-12 p-3 rounded-moon-i-sm" },
    disabled: { true: "", false: "" },
    error: { true: "", false: "" },
  },
  compoundVariants: [],
  defaultVariants: {
    size: "md",
    color: "piccolo",
  },
});
const arrowVariants = cva("i-lucide:chevron-down", {
  variants: {
    size: {
      sm: "absolute top-1/2 end-3 -translate-y-1/2 z-5 pointer-events-none text-trunks flex-shrink-0 transition-transform text-moon-16",
      md: "absolute top-1/2 end-3 -translate-y-1/2 z-5 pointer-events-none text-trunks flex-shrink-0 transition-transform text-moon-16",
      lg: "absolute top-1/2 end-3 -translate-y-1/2 z-5 pointer-events-none text-trunks flex-shrink-0 transition-transform text-moon-16",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
type SelectTriggerVariants = VariantProps<typeof selectTriggerVariants>;

const props = withDefaults(defineProps<SelectTriggerProps & {
  class?: HTMLAttributes["class"];
  color?: SelectTriggerVariants["color"];
  size?: SelectTriggerVariants["size"];
}>(), {
  color: "piccolo",
  size: "md",
});

const delegatedProps = computed(() => {
  const { class: _, color: _co, size: _si, ...delegated } = props;
  return delegated;
});
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectTrigger
    v-bind="forwardedProps"
    class="trigger" :class="[selectTriggerVariants({ color, size, disabled }), props.class]"
  >
    <span class="flex w-full flex-col items-start text-start overflow-hidden">
      <slot />
    </span>
    <SelectIcon as-child>
      <span :class="arrowVariants({ size })" />
    </SelectIcon>
  </SelectTrigger>
</template>

<style scoped>
.trigger:hover {
  box-shadow: inset 0 0 0 var(--border-i-width) var(--trunks), inset 0 0 0 var(--border-i-width) var(--beerus);
}
.rs-piccolo:focus,
.rs-piccolo:focus-visible,
.rs-piccolo[data-state=open] {
  outline: none;
  box-shadow: 0 0 0 var(--border-i-width) var(--piccolo) inset;
}
.rs-hit:focus,
.rs-hit:focus-visible,
.rs-hit[data-state=open] {
  outline: none;
  box-shadow: 0 0 0 var(--border-i-width) var(--hit) inset;
}
.trigger:disabled {
  opacity: var(--opacity-moon);
  cursor: not-allowed;
}
</style>
