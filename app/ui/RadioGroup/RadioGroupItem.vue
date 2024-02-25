<script setup lang="ts">
import { type HTMLAttributes, computed, inject } from "vue";
import { RadioGroupIndicator, RadioGroupItem, type RadioGroupItemProps, useForwardProps } from "radix-vue";
import { type VariantProps, cva } from "cva";

const radioGroupItemVariants = cva("relative aspect-square h-4.5 w-4.5 rounded-full border border-trunks ring-offset-2 ring-offset-goku focus:outline-none focus-visible:ring-2 ring-bulma disabled:cursor-not-allowed disabled:opacity-50", {
  variants: {
    color: { default: "data-[state=checked]:(border-bulma text-bulma)", piccolo: "data-[state=checked]:(border-piccolo text-piccolo)", hit: "data-[state=checked]:(border-hit text-hit)", chichi: "data-[state=checked]:(border-chichi text-chichi)", krillin: "data-[state=checked]:(border-krillin text-krillin)", roshi: "data-[state=checked]:(border-roshi text-roshi)" },
    disabled: { true: "cursor-default opacity-60", false: "cursor-pointer" },
  },
  defaultVariants: {
    color: "default",
  },
});
type RadioGroupItemVariants = VariantProps<typeof radioGroupItemVariants>;

const props = defineProps<RadioGroupItemProps & {
  class?: HTMLAttributes["class"];
  color?: RadioGroupItemVariants["color"];
}>();

// Provided by RadioGroup.vue
const context = inject<{
  color: RadioGroupItemVariants["color"];
  disabled: boolean;
}>("radioGroup");

const delegatedProps = computed(() => {
  const { class: _cl, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <RadioGroupItem
    v-bind="forwarded"
    :disabled="context?.disabled || disabled"
    :class="radioGroupItemVariants({ color: color || context?.color, disabled: disabled || context?.disabled })"
  >
    <RadioGroupIndicator
      class="absolute flex items-center justify-center w-0 h-0 aspect-square rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 data-[state=checked]:(w-2.5 h-2.5) text-current bg-current"
    />
  </RadioGroupItem>
</template>
