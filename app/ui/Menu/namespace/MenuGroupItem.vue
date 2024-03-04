<script setup lang="ts">
import { ToggleGroupItem, type ToggleGroupItemProps, useForwardProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import MenuItem from "./MenuItem.vue";

import { menuItemKey } from "./providers";

const props = withDefaults(defineProps<ToggleGroupItemProps & {
  class?: HTMLAttributes["class"];
  isActive?: boolean;
}>(), {
  as: "div",
});
const delegatedProps = computed(() => {
  const { class: _cl, isActive: _ia, ...delegated } = props;
  return delegated;
});
const forwardedProps = useForwardProps(delegatedProps);

const { value, disabled } = toRefs(props);
provide(menuItemKey, {
  value,
  disabled,
});
</script>

<template>
  <ToggleGroupItem
    v-bind="forwardedProps"
    as-child
  >
    <MenuItem>
      <slot />
    </MenuItem>
  </ToggleGroupItem>
</template>
