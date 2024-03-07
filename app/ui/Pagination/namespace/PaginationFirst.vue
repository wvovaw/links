<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { PaginationFirst, type PaginationFirstProps } from "radix-vue";
import { UIButton } from "../../Button";

const props = withDefaults(defineProps<PaginationFirstProps & {
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
  <PaginationFirst v-bind="delegatedProps">
    <UIButton
      :class="[props.class]"
      size="sm"
      icon="i-lucide:chevrons-left"
      variant="outline"
    />
  </PaginationFirst>
</template>
