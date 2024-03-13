<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { ToggleGroupRoot, type ToggleGroupRootEmits, type ToggleGroupRootProps, useForwardPropsEmits } from "radix-vue";
import type { ToggleVariants } from "../Toggle/private/ToggleItem.vue";
import { TOGGLE_GROUP_INJECTION_KEY } from "./providers";

const props = withDefaults(defineProps<ToggleGroupRootProps & {
  class?: HTMLAttributes["class"];
  variant?: ToggleVariants["variant"];
  color?: ToggleVariants["color"];
  withStroke?: boolean;
  size?: ToggleVariants["size"];
}>(), {
  type: "single",
});

const emits = defineEmits<ToggleGroupRootEmits>();

provide(TOGGLE_GROUP_INJECTION_KEY, {
  variant: props.variant,
  color: props.color,
  withStroke: props.withStroke,
  size: props.size,
  disabled: props.disabled,
});

const delegatedProps = computed(() => {
  const { class: _cl, color: _co, variant: _v, withStroke: _ws, size: _s, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <ToggleGroupRoot v-bind="forwarded" class="flex items-center justify-center gap-1" :class="props.class">
    <slot />
  </ToggleGroupRoot>
</template>
