<script setup lang="ts">
import { UIRadioItem } from "../../RadioItem";
import { menuItemKey, menuItemsGroupKey } from "./providers";

defineProps<{
  // FIXME: This need to be exported from UIRadioItem as UIRadioItemProps
  color?: "default" | "piccolo" | "hit" | "roshi" | "chichi" | "krillin";
}>();

const menuItemCtx = inject(menuItemKey);
const menuItemsGroupCtx = inject(menuItemsGroupKey);

const checked = computed(() => menuItemCtx ? menuItemsGroupCtx?.modelValue.value?.includes(menuItemCtx?.value.value) : false);
const disabled = computed(() => menuItemCtx?.disabled.value);
</script>

<template>
  <UIRadioItem.Root :disabled="disabled" :color="color" :data-state="checked ? 'checked' : 'unchecked'" />
</template>
