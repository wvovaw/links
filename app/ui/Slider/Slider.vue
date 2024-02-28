<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import type { SliderRootEmits, SliderRootProps } from "radix-vue";
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardPropsEmits } from "radix-vue";
import { type VariantProps, cva } from "cva";

const sliderRootVariants = cva("relative flex w-full touch-none select-none items-center", {
  variants: {
  },
});

const props = defineProps<SliderRootProps & {
  class?: HTMLAttributes["class"];
}>();
const emits = defineEmits<SliderRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SliderRoot
    :class="[sliderRootVariants({}), props.class]"
    v-bind="forwarded"
  >
    <SliderTrack class="relative h-2 w-full grow overflow-hidden rounded-full bg-jiren">
      <SliderRange class="absolute h-full bg-piccolo" />
    </SliderTrack>
    <SliderThumb class="block border-box h-5 w-5 rounded-full border-(2 trunks) shadow-(moon-lg popo) bg-goten focus:outline-none focus-visible:(outline-none ring-3 ring-jiren) disabled:(pointer-events-none opacity-60)" />
  </SliderRoot>
</template>
