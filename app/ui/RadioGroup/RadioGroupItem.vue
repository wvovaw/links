<script setup lang="ts">
import { type HTMLAttributes, computed, inject } from "vue";
import { RadioGroupIndicator, RadioGroupItem, type RadioGroupItemProps, useForwardProps } from "radix-vue";
import { UIRadioItem, type UIRadioItemVariants } from "../RadioItem";
import { RADIO_GROUP_INJECTION_KEY } from "./providers";

const props = defineProps<RadioGroupItemProps & UIRadioItemVariants & {
  class?: HTMLAttributes["class"];
}>();

const context = inject(RADIO_GROUP_INJECTION_KEY);

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
