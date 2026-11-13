<script setup lang="ts">
import { PaginationPrev, type PaginationPrevProps } from "reka-ui";
import { type HTMLAttributes, computed } from "vue";

import { UIButton } from "../../Button";

const props = withDefaults(
  defineProps<
    PaginationPrevProps & {
      class?: HTMLAttributes["class"];
    }
  >(),
  {
    asChild: true,
  },
);

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <PaginationPrev v-bind="delegatedProps">
    <UIButton :class="[props.class]" size="sm" icon="i-lucide:chevron-left" variant="outline" />
  </PaginationPrev>
</template>
