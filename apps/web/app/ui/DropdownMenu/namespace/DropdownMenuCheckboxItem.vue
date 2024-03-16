<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import type { DropdownMenuCheckboxItemEmits, DropdownMenuCheckboxItemProps } from "radix-vue";
import { DropdownMenuCheckboxItem, useForwardPropsEmits } from "radix-vue";
import { Item as MenuItem } from "../../Menu/namespace";
import { UICheckbox, type UICheckboxVariants } from "../../Checkbox";

const props = defineProps<DropdownMenuCheckboxItemProps & UICheckboxVariants & {
  class?: HTMLAttributes["class"];
}>();
const emits = defineEmits<DropdownMenuCheckboxItemEmits>();
const delegatedProps = computed(() => {
  const { class: _, color: _co, size: _si, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DropdownMenuCheckboxItem
    v-bind="forwarded"
    :class="[
      props.class,
    ]"
    as-child
  >
    <MenuItem class="group">
      <slot />
      <UICheckbox :checked="checked" :disabled="disabled" :color="color" :size="size" />
    </MenuItem>
  </DropdownMenuCheckboxItem>
</template>
