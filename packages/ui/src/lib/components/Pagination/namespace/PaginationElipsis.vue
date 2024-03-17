<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { PaginationEllipsis, type PaginationEllipsisProps } from "radix-vue";

const props = defineProps<PaginationEllipsisProps & {
  class?: HTMLAttributes["class"];
}>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <PaginationEllipsis
    v-bind="delegatedProps"
    class="w-9 h-9 flex items-center justify-center"
    :class="[props.class]"
  >
    <slot>
      <span class="i-lucide:more-horizontal" />
    </slot>
  </PaginationEllipsis>
</template>
