<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import type { SliderRootEmits, SliderRootProps } from "radix-vue";
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardPropsEmits } from "radix-vue";
import { type VariantProps, cva } from "cva";

const variants = {
  color: { piccolo: "", hit: "", chichi: "", krillin: "", roshi: "" },
  size: { sm: "", md: "", lg: "" },
};

const rootVariants = cva("relative h-fit flex w-full touch-none select-none items-center", { variants });
const trackVariants = cva("relative w-full grow overflow-hidden rounded-full", { variants, compoundVariants: [
  { color: "piccolo", class: "bg-jiren" },
  { color: "hit", class: "bg-jira" },
  { color: "chichi", class: "bg-chichi-60" },
  { color: "krillin", class: "bg-krillin-60" },
  { color: "roshi", class: "bg-roshi-60" },
  { size: "sm", class: "h-1.5" },
  { size: "md", class: "h-2" },
  { size: "lg", class: "h-3" },
] });
const rangeVariants = cva("absolute h-full", { variants, compoundVariants: [
  { color: "piccolo", class: "bg-piccolo" },
  { color: "hit", class: "bg-hit" },
  { color: "chichi", class: "bg-chichi" },
  { color: "krillin", class: "bg-krillin" },
  { color: "roshi", class: "bg-roshi" },
] });
const thumbVariants = cva("cursor-grab block rounded-full shadow-(moon-lg popo) focus:outline-none focus-visible:outline-none", {
  variants,
  compoundVariants: [
    { color: "piccolo", class: "border-piccolo bg-goten focus:(ring-jiren bg-piccolo)" },
    { color: "hit", class: "border-hit bg-goten focus:(ring-jira bg-hit)" },
    { color: "chichi", class: "border-chichi bg-goten focus:(ring-chichi-60 bg-chichi)" },
    { color: "krillin", class: "border-krillin bg-goten focus:(ring-krillin-60 bg-krillin)" },
    { color: "roshi", class: "border-roshi bg-goten focus:(ring-roshi-60 bg-roshi)" },
    { size: "sm", class: "h-3 w-3 border-4 focus:(ring-3)" },
    { size: "md", class: "h-4 w-4 border-5 focus:(ring-4)" },
    { size: "lg", class: "h-5 w-5 border-6 focus:(ring-4)" },
  ],
});
type SliderVariants = VariantProps<typeof rootVariants>;

const props = withDefaults(defineProps<SliderRootProps & {
  class?: HTMLAttributes["class"];
  color?: SliderVariants["color"];
  size?: SliderVariants["size"];
  nOfThumbs?: number;
}>(), {
  nOfThumbs: 1,
  color: "piccolo",
  size: "md",
});
const emits = defineEmits<SliderRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, nOfThumbs: _n, color: _co, size: _s, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SliderRoot
    :class="[rootVariants({ color, size }), props.class]"
    v-bind="forwarded"
  >
    <SliderTrack :class="trackVariants({ color, size })">
      <SliderRange :class="rangeVariants({ color, size })" />
    </SliderTrack>

    <SliderThumb
      v-for="thumb of nOfThumbs"
      :key="thumb"
      :class="thumbVariants({ color, size })"
    />
  </SliderRoot>
</template>
