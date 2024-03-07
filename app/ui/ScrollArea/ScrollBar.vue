<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { ScrollAreaScrollbar, type ScrollAreaScrollbarProps, ScrollAreaThumb } from "radix-vue";

const props = withDefaults(defineProps<ScrollAreaScrollbarProps & {
  barClass?: HTMLAttributes["class"];
  thumbClass?: HTMLAttributes["class"];
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
        'h-full w-3 bg-heles px-3px': orientation === 'vertical',
        'h-3 flex-col bg-heles py-3px': orientation === 'horizontal',
      },
      props.barClass,
    ]"
  >
    <ScrollAreaThumb class="relative flex-1 rounded-full bg-gohan" :class="props.thumbClass" />
  </ScrollAreaScrollbar>
</template>
