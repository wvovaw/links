<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { DropdownMenuLabel, type DropdownMenuLabelProps, useForwardProps } from "radix-vue";

const props = defineProps<DropdownMenuLabelProps & {
  class?: HTMLAttributes["class"];
  inset?: boolean;
}>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <DropdownMenuLabel
    v-bind="forwardedProps"
    class="px-2 py-1.5 text-sm text-trunks flex items-center gap-2 select-none"
    :class="[
      inset && 'pl-4',
      props.class,
    ]"
  >
    <slot />
  </DropdownMenuLabel>
</template>
