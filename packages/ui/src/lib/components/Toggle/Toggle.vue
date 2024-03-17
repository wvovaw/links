<script setup lang="ts">
import { Toggle, type ToggleEmits, type ToggleProps, useForwardPropsEmits } from "radix-vue";
import { computed } from "vue";
import type { ToggleVariants } from "./private/ToggleItem.vue";
import ToggleItem from "./private/ToggleItem.vue";

const emits = defineEmits<ToggleEmits>();

const props = withDefaults(defineProps<ToggleProps & ToggleVariants>(), {
  variant: "default",
  color: "piccolo",
  iconPos: "left",
  withStroke: false,
  size: "md",
});

const delegatedProps = computed(() => {
  const { variant: _v, color: _c, size: _s, icon: _i, iconPos: _ip, withStroke: _ws, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <Toggle
    v-bind="forwarded"
    as-child
  >
    <ToggleItem
      :color="color"
      :variant="variant"
      :icon="icon"
      :icon-pos="iconPos"
      :size="size"
      :with-stroke="withStroke"
    >
      <slot />
    </ToggleItem>
  </Toggle>
</template>
