<script setup lang="ts">
import { type HTMLAttributes, computed, inject, provide, readonly, toRefs } from "vue";
import { TabsList, type TabsListProps } from "radix-vue";
import { type VariantProps, cva } from "cva";

const tabsListVariants = cva("flex items-center justify-center w-fit", {
  variants: {
    variant: {
      pill: "bg-gohan",
      tab: "",
    },
    size: { sm: "", md: "", lg: "" },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  compoundVariants: [
    { variant: "pill", size: ["sm", "md"], class: "rounded-moon-s-sm gap-1 p-1" },
    { variant: "pill", size: "lg", class: "rounded-moon-s-md gap-2 p-2" },
  ],
});
type TabsSegmentVariants = VariantProps<typeof tabsListVariants>;

const props = withDefaults(defineProps<TabsListProps & {
  class?: HTMLAttributes["class"];
  size?: TabsSegmentVariants["size"];
  variant?: TabsSegmentVariants["variant"];
}>(), {
  size: "md",
  variant: "pill",
});

const delegatedProps = computed(() => {
  const { class: _, size: _s, ...delegated } = props;
  return delegated;
});

// Provided by Tabs.vue
const { orientation } = inject<{ orientation: "horizontal" | "vertical" }>("tabs", { orientation: "horizontal" });

const { size, variant } = toRefs(props);
provide("tabsList", {
  size: readonly(size),
  variant: readonly(variant),
});
</script>

<template>
  <TabsList
    v-bind="delegatedProps"
    :class="[tabsListVariants({ size, variant, orientation }), props.class]"
  >
    <slot />
  </TabsList>
</template>
