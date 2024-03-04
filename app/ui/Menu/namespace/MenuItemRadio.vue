<script setup lang="ts">
import { menuItemKey, menuItemsGroupKey } from "./providers";

const menuItemCtx = inject(menuItemKey);
const menuItemsGroupCtx = inject(menuItemsGroupKey);

const checked = computed(() => menuItemCtx ? menuItemsGroupCtx?.modelValue.value?.includes(menuItemCtx?.value.value) : false);
</script>

<template>
  <span class="flex w-6 h-6 justify-center items-center relative">
    <div
      class="relative aspect-square h-4.5 w-4.5 rounded-full border border-trunks ring-offset-2 ring-offset-goku focus:outline-none focus-visible:ring-2 ring-bulma data-[state=checked]:(border-bulma text-bulma)"
      :data-state="checked ? 'checked' : 'unchecked'"
      :aria-checked="checked ? true : false"
      role="radio"
      aria-required="false"
    >
      <div
        :data-state="checked ? 'checked' : 'unchecked'"
        class="absolute flex items-center justify-center w-0 h-0 aspect-square rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 data-[state=checked]:(w-2.5 h-2.5) text-current bg-current"
      />
    </div>
  </span>
</template>
./providers
