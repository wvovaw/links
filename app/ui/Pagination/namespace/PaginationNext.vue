<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { PaginationNext, type PaginationNextProps } from "radix-vue";
import { UIButton } from "../../Button";

const props = withDefaults(defineProps<PaginationNextProps & {
  class?: HTMLAttributes["class"];
}>(), {
  asChild: true,
});

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <PaginationNext v-bind="delegatedProps">
    <UIButton
      :class="[props.class]"
      size="sm"
      icon="i-lucide:chevron-right"
      variant="outline"
    />
  </PaginationNext>
</template>
