<script setup lang="ts">
import { type HTMLAttributes, computed, inject } from "vue";
import { RadioGroupIndicator, RadioGroupItem, type RadioGroupItemProps, useForwardProps } from "radix-vue";
import { type VariantProps, cva } from "cva";
import { UIRadioItem } from "../RadioItem";

// FIXME: This is a dup code. It mirrors RadioItem variants. Make the single source of true
const radioGroupItemVariants = cva("", {
  variants: {
    color: { default: "", piccolo: "", hit: "", chichi: "", krillin: "", roshi: "" },
    disabled: { true: "", false: "" },
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
    as-child
  >
    <UIRadioItem.Root :color="color || context?.color">
      <RadioGroupIndicator as-child>
        <UIRadioItem.Indicator />
      </RadioGroupIndicator>
    </UIRadioItem.Root>
  </RadioGroupItem>
</template>
