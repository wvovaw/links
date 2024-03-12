<script setup lang="ts">
import { type VariantProps, cva } from "cva";
import type { HTMLAttributes } from "vue";
import RadioItemIndicator from "./RadioItemIndicator.vue";

const radioItemVariants = cva("relative aspect-square h-4.5 w-4.5 rounded-full border border-trunks ring-offset-2 ring-offset-goku focus:outline-none focus-visible:ring-2 ring-bulma", {
  variants: {
    color: {
      default: "data-[state=checked]:(border-bulma text-bulma) group-data-[state=checked]:(border-bulma text-bulma)",
      piccolo: "data-[state=checked]:(border-piccolo text-piccolo) group-data-[state=checked]:(border-piccolo text-piccolo)",
      hit: "data-[state=checked]:(border-hit text-hit) group-data-[state=checked]:(border-hit text-hit)",
      chichi: "data-[state=checked]:(border-chichi text-chichi) group-data-[state=checked]:(border-chichi text-chichi)",
      krillin: "data-[state=checked]:(border-krillin text-krillin) group-data-[state=checked]:(border-krillin text-krillin)",
      roshi: "data-[state=checked]:(border-roshi text-roshi) group-data-[state=checked]:(border-roshi text-roshi)",
    },
    disabled: { true: "cursor-default opacity-60", false: "cursor-pointer" },
  },
  defaultVariants: {
    color: "default",
  },
});
type RadioItemVariants = VariantProps<typeof radioItemVariants>;

defineProps<{
  class?: HTMLAttributes["class"];
  color?: RadioItemVariants["color"];
}>();
</script>

<template>
  <span :class="radioItemVariants({ color })" class="group">
    <slot>
      <RadioItemIndicator />
    </slot>
  </span>
</template>
