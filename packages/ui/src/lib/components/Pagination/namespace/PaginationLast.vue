<script setup lang="ts">
import { PaginationLast, type PaginationLastProps } from "reka-ui";
import { type HTMLAttributes, computed } from "vue";

import { UIButton } from "../../Button";

const props = withDefaults(
  defineProps<
    PaginationLastProps & {
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
  <PaginationLast v-bind="delegatedProps">
    <UIButton :class="[props.class]" size="sm" icon="i-lucide:chevrons-right" variant="outline" />
  </PaginationLast>
</template>
