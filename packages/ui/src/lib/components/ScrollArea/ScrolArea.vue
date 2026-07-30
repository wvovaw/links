<script setup lang="ts">
import type { ScrollAreaRootProps } from "radix-vue";

import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from "radix-vue";
import { type HTMLAttributes, computed } from "vue";

import ScrollBar from "./ScrollBar.vue";

const props = withDefaults(
  defineProps<
    ScrollAreaRootProps & {
      class?: HTMLAttributes["class"];
      barClass?: HTMLAttributes["class"];
      thumbClass?: HTMLAttributes["class"];
      orientation?: "vertical" | "horizontal" | "both";
    }
  >(),
  {
    orientation: "both",
  },
);

const delegatedProps = computed(() => {
  const {
    class: _class,
    barClass: _barClass,
    thumbClass: _thumbClass,
    orientation: _orientation,
    ...delegated
  } = props;
  return delegated;
});

const scrollbars = computed(() =>
  props.orientation === "both" ? (["vertical", "horizontal"] as const) : ([props.orientation] as const),
);
</script>

<template>
  <ScrollAreaRoot v-bind="delegatedProps" class="relative overflow-hidden" :class="props.class">
    <ScrollAreaViewport class="h-full w-full rounded-[inherit]">
      <slot />
    </ScrollAreaViewport>
    <ScrollBar v-for="o in scrollbars" :key="o" :orientation="o" :bar-class="barClass" :thumb-class="thumbClass" />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
