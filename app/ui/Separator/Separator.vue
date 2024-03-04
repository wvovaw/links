<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Separator, type SeparatorProps } from "radix-vue";

const props = defineProps<SeparatorProps & {
  class?: HTMLAttributes["class"];
}>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <Separator
    v-bind="delegatedProps"
    class="shrink-0 bg-beerus"
    :class="[props.orientation === 'vertical' ? 'w-1px h-full' : 'h-1px w-full', props.class]"
  />
</template>
