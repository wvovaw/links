<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import type { HTMLAttributes } from "vue";

const props = withDefaults(defineProps< PrimitiveProps & {
  class?: HTMLAttributes["class"];
  isActive?: boolean;
}>(), {
  as: "div",
});
</script>

<template>
  <Primitive
    class="flex gap-2 justify-between items-center p-2 bg-transparent rounded-moon-i-sm text-moon-14 text-bulma focus:outline-none focus:shadow-focus cursor-pointer hover:bg-heles focus:bg-heles group-focus:bg-heles transition-background-color w-full data-[disabled]:(text-trunks) data-[menuitem-active=true]:bg-heles" :class="props.class"
    :data-menuitem-active="isActive"
    v-bind="props"
  >
    <slot />
  </Primitive>
</template>
