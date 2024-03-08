<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "cva";

const alertVariants = cva("relative flex flex-col w-full gap-x-3 gap-y-1 p-4 rounded-moon-s-sm bg-goku text-moon-14 text-bulma", {
  variants: { },
});
// type AlertVariants = VariantProps<typeof alertVariants>;

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div :class="[alertVariants({ }), props.class]" role="alert">
    <slot />
  </div>
</template>
