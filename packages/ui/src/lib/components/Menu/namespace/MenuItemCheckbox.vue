<script setup lang="ts">
import { computed, inject } from "vue";

import type { UICheckboxVariants } from "../../Checkbox";

import { UICheckbox } from "../../Checkbox";
import { menuItemKey, menuItemsGroupKey } from "./providers";

defineProps<UICheckboxVariants>();

const menuItemCtx = inject(menuItemKey);
const menuItemsGroupCtx = inject(menuItemsGroupKey);

const checked = computed(() => {
  const selected = menuItemsGroupCtx?.modelValue.value;
  return menuItemCtx && Array.isArray(selected) ? selected.includes(menuItemCtx.value.value) : false;
});
const disabled = computed(() => menuItemCtx?.disabled.value);
</script>

<template>
  <span class="flex w-6 h-6 justify-center items-center relative">
    <UICheckbox :model-value="checked" :disabled="disabled" :color="color" :size="size" />
  </span>
</template>
