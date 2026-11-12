<script setup lang="ts">
import { SelectSeparator, type SelectSeparatorProps } from "reka-ui";
import { type HTMLAttributes, computed } from "vue";

const props = defineProps<SelectSeparatorProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <SelectSeparator v-bind="delegatedProps" class="-mx-1 my-1 h-px bg-beerus" :class="props.class" />
</template>
