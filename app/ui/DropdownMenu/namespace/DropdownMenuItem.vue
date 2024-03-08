<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { DropdownMenuItem, type DropdownMenuItemProps, useForwardProps } from "radix-vue";

const props = defineProps<DropdownMenuItemProps & {
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
  <DropdownMenuItem
    v-bind="forwardedProps"
    class="relative flex cursor-default select-none items-center rounded-moon-s-sm px-2 py-1.5 text-moon-14 outline-none transition-colors focus:bg-heles focus:text-bulma data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    :class="[
      inset && 'pl-8',
      props.class,
    ]"
  >
    <slot />
  </DropdownMenuItem>
</template>
