<script setup lang="ts">
import { type HTMLAttributes, type LabelHTMLAttributes, computed } from "vue";

import { Label, type LabelProps } from "radix-vue";
import { type VariantProps, cva } from "cva";

const labelVariants = cva("w-full block text-bulma pb-2", {
  variants: {
    size: {
      sm: "text-moon-14",
      md: "text-moon-16",
      lg: "text-moon-16",
    },
    disabled: { true: "opacity-60 cursor-not-allowed", false: "" },
  },
  defaultVariants: {
    disabled: false,
    size: "md",
  },
});
type LabelVariants = VariantProps<typeof labelVariants>;

const props = defineProps<LabelProps & {
  class?: HTMLAttributes["class"];
  for?: LabelHTMLAttributes["for"];
  size?: LabelVariants["size"];
  disabled?: boolean;
}>();

const delegatedProps = computed(() => {
  const { class: _, disabled: _d, size: _s, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <Label
    v-bind="delegatedProps"
    :class="[labelVariants({ size, disabled }), props.class]"
  >
    <slot />
  </Label>
</template>
