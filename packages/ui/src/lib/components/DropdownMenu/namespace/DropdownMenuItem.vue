<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { DropdownMenuItem, type DropdownMenuItemProps, useForwardProps } from "radix-vue";
import { Item as MenuItem } from "../../Menu/namespace";

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
    :class="[
      inset && 'pl-8',
      props.class,
    ]"
    as-child
  >
    <MenuItem class="data-[state=open]:bg-heles data-[disabled]:(hover:bg-transparent cursor-not-allowed)">
      <slot />
    </MenuItem>
  </DropdownMenuItem>
</template>
