<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { ToggleGroupRoot, type ToggleGroupRootEmits, type ToggleGroupRootProps, useForwardPropsEmits } from "radix-vue";
import { menuItemsGroupKey } from "./providers";

const props = withDefaults(defineProps<ToggleGroupRootProps & {
  class?: HTMLAttributes["class"];
}>(), {
  type: "single",
});

const emits = defineEmits<ToggleGroupRootEmits>();

const delegatedProps = computed(() => {
  const { class: _cl, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);

const { modelValue } = toRefs(props);
provide(menuItemsGroupKey, {
  modelValue,
});
</script>

<template>
  <ToggleGroupRoot v-bind="forwarded" :class="props.class">
    <slot />
  </ToggleGroupRoot>
</template>
