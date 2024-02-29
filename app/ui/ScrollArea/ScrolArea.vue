<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import type { ScrollAreaRootProps } from "radix-vue";
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from "radix-vue";
import ScrollBar from "./ScrollBar.vue";

const props = defineProps<ScrollAreaRootProps & {
  class?: HTMLAttributes["class"];
}>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <ScrollAreaRoot
    v-bind="delegatedProps"
    class="relative overflow-hidden"
    :class="props.class"
  >
    <ScrollAreaViewport class="h-full w-full rounded-[inherit]">
      <slot />
    </ScrollAreaViewport>
    <ScrollBar orientation="vertical" />
    <ScrollBar orientation="horizontal" />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
