<script setup lang="ts">
import { type HTMLAttributes, computed, inject, provide } from "vue";
import { TabsList, type TabsListProps } from "radix-vue";
import { type VariantProps, cva } from "cva";

const tabsListVariants = cva("flex items-center justify-center w-fit bg-gohan ", {
  variants: {
    size: {
      sm: "rounded-moon-s-sm gap-1 p-1",
      md: "rounded-moon-s-sm gap-1 p-1",
      lg: "rounded-moon-s-md gap-2 p-2",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});
type TabsSegmentVariants = VariantProps<typeof tabsListVariants>;

const props = withDefaults(defineProps<TabsListProps & {
  class?: HTMLAttributes["class"];
  size?: TabsSegmentVariants["size"];
}>(), {
  size: "sm",
});

const delegatedProps = computed(() => {
  const { class: _, size: _s, ...delegated } = props;
  return delegated;
});

// Provided by Tabs.vue
const { orientation } = inject<{ orientation: "horizontal" | "vertical" }>("tabs");
provide("tabsList", {
  size: props.size,
});
</script>

<template>
  <TabsList
    v-bind="delegatedProps"
    :class="[tabsListVariants({ size, orientation }), props.class]"
  >
    <slot />
  </TabsList>
</template>
