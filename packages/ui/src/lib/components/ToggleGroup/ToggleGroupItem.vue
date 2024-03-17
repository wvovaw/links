<script setup lang="ts">
import { type HTMLAttributes, computed, inject } from "vue";
import { ToggleGroupItem, type ToggleGroupItemProps, useForwardProps } from "radix-vue";
import type { ToggleVariants } from "../Toggle/private/ToggleItem.vue";
import ToggleItem from "../Toggle/private/ToggleItem.vue";
import { TOGGLE_GROUP_INJECTION_KEY } from "./providers";

const props = defineProps<ToggleGroupItemProps & ToggleVariants & {
  class?: HTMLAttributes["class"];
}>();
const delegatedProps = computed(() => {
  const { class: _, variant: _v, size: _s, color: _c, withStroke: _ws, icon: _i, iconPos: _ip, ...delegated } = props;
  return delegated;
});
const forwardedProps = useForwardProps(delegatedProps);

const context = inject(TOGGLE_GROUP_INJECTION_KEY);
</script>

<template>
  <ToggleGroupItem
    v-bind="forwardedProps"
    as-child
  >
    <ToggleItem
      :variant="context?.variant || variant"
      :size="context?.size || size"
      :color="context?.color || color"
      :with-stroke="context?.withStroke || withStroke"
      :icon="icon"
      :icon-pos="iconPos"
      :disabled="context?.disabled || disabled"
    >
      <slot />
    </ToggleItem>
  </ToggleGroupItem>
</template>
