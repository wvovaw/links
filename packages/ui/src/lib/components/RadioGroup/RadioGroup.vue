<script setup lang="ts">
import { RadioGroupRoot, type RadioGroupRootEmits, type RadioGroupRootProps, useForwardPropsEmits } from "radix-vue";
import { type HTMLAttributes, computed, provide } from "vue";
import { type VariantProps, cva } from "cva";
import { RADIO_GROUP_INJECTION_KEY } from "./providers";

const radioGroupVariants = cva("", {
  variants: {
    color: { default: "", piccolo: "", hit: "", chichi: "", krillin: "", roshi: "" },
  },
  defaultVariants: {
    color: "default",
  },
});
type RadioRootVariants = VariantProps<typeof radioGroupVariants>;

const props = withDefaults(defineProps<RadioGroupRootProps & {
  class?: HTMLAttributes["class"];
  color?: RadioRootVariants["color"];
}>(), {
  color: "default",
});
const emits = defineEmits<RadioGroupRootEmits>();

const delegatedProps = computed(() => {
  const { class: _cl, color: _co, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);

provide(RADIO_GROUP_INJECTION_KEY, {
  color: props.color,
  disabled: props.disabled,
});
</script>

<template>
  <RadioGroupRoot
    v-bind="forwarded"
    class="grid gap-2"
    :class="props.class"
  >
    <slot />
  </RadioGroupRoot>
</template>
