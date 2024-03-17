<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { SwitchRoot, type SwitchRootEmits, type SwitchRootProps, SwitchThumb, useForwardPropsEmits } from "radix-vue";
import { type VariantProps, cva } from "cva";

const switchRootVariants = cva("block cursor-pointer rounded-full transition", {
  variants: {
    color: {
      piccolo: "moon-checked:bg-piccolo",
      hit: "moon-checked:bg-hit",
      chichi: "moon-checked:bg-chichi",
      krillin: "moon-checked:bg-krillin",
      roshi: "moon-checked:bg-roshi",
    },
    size: { xs: "w-7 h-4 p-0.5", sm: "w-11 h-6 p-1", md: "w-[3.75rem] h-8 p-1" },
  },
  compoundVariants: [
    {
      color: ["piccolo", "hit", "krillin", "roshi", "chichi"],
      class: "bg-beerus",
    },
    { color: "piccolo", class: "data-[state=checked]:bg-piccolo" },
    { color: "hit", class: "data-[state=checked]:bg-hit" },
    { color: "krillin", class: "data-[state=checked]:bg-krillin" },
    { color: "roshi", class: "data-[state=checked]:bg-roshi" },
    { color: "chichi", class: "data-[state=checked]:bg-chichi" },
  ],
  defaultVariants: {
    color: "piccolo",
    size: "md",
  },
});
type SwitchRootVariants = VariantProps<typeof switchRootVariants>;
const switchThumbVariants = cva("absolute top-1/2 -translate-y-1/2 shadow-moon-sm pointer-events-none rounded-full bg-goten transition-all start-0", {
  variants: {
    size: { xs: "w-3 h-3", sm: "w-4 h-4", md: "w-6 h-6" },
  },
  compoundVariants: [
    { size: "xs", class: "data-[state=checked]:(ltr:left-[calc(100%-12px)] rtl:right-[calc(100%-12px)])" },
    { size: "sm", class: "data-[state=checked]:(ltr:left-[calc(100%-16px)] rtl:right-[calc(100%-16px)])" },
    { size: "md", class: "data-[state=checked]:(ltr:left-[calc(100%-24px)] rtl:right-[calc(100%-24px)])" },
  ],
  defaultVariants: {
    size: "md",
  },
});

const props = withDefaults(defineProps<SwitchRootProps & {
  color?: SwitchRootVariants["color"];
  size?: SwitchRootVariants["size"];
  class?: HTMLAttributes["class"];
}>(), {
  color: "piccolo",
  size: "md",
});
const emits = defineEmits<SwitchRootEmits>();

const delegatedProps = computed(() => {
  const { class: _c, color: _co, size: _s, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    :class="switchRootVariants({ color, size })"
  >
    <span class="block relative h-full w-full">
      <SwitchThumb
        :class="switchThumbVariants({ size })"
      />
    </span>
  </SwitchRoot>
</template>
