<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { ScrollAreaScrollbar, type ScrollAreaScrollbarProps, ScrollAreaThumb } from "radix-vue";

const props = withDefaults(defineProps<ScrollAreaScrollbarProps & {
  class?: HTMLAttributes["class"];
}>(), {
  orientation: "vertical",
});

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <ScrollAreaScrollbar
    v-bind="delegatedProps"
    class="flex touch-none select-none transition-colors"
    :class="[
      {
        'h-full w-3 bg-heles p-px': orientation === 'vertical',
        'h-3 flex-col bg-heles p-px': orientation === 'horizontal',
      },
      props.class,
    ]"
  >
    <ScrollAreaThumb class="relative flex-1 rounded-full bg-bulma" />
  </ScrollAreaScrollbar>
</template>
