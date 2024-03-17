<script setup lang="ts">
import { computed, inject } from "vue";
import { UIRadioItem, type UIRadioItemVariants } from "../../RadioItem";
import { menuItemKey, menuItemsGroupKey } from "./providers";

defineProps<UIRadioItemVariants>();

const menuItemCtx = inject(menuItemKey);
const menuItemsGroupCtx = inject(menuItemsGroupKey);

const checked = computed(() => menuItemCtx ? menuItemsGroupCtx?.modelValue.value?.includes(menuItemCtx?.value.value) : false);
const disabled = computed(() => menuItemCtx?.disabled.value);
</script>

<template>
  <UIRadioItem.Root :disabled="disabled" :color="color" :data-state="checked ? 'checked' : 'unchecked'" />
</template>
