<script setup lang="ts">
import { UICheckbox } from "../../Checkbox";
import { menuItemKey, menuItemsGroupKey } from "./providers";

defineProps<{
  // FIXME: This need to be exported from UICheckbox as UICheckboxProps
  color?: "default" | "piccolo" | "hit" | "roshi" | "chichi" | "krillin";
  size?: "sm" | "md";
}>();

const menuItemCtx = inject(menuItemKey);
const menuItemsGroupCtx = inject(menuItemsGroupKey);

const checked = computed(() => menuItemCtx ? menuItemsGroupCtx?.modelValue.value?.includes(menuItemCtx?.value.value) : false);
const disabled = computed(() => menuItemCtx?.disabled.value);
</script>

<template>
  <span class="flex w-6 h-6 justify-center items-center relative">
    <UICheckbox :checked="checked" :disabled="disabled" :color="color" :size="size" />
  </span>
</template>
