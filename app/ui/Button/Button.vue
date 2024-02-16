<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";

interface IButtonProps extends PrimitiveProps {
};
const props = withDefaults(defineProps<IButtonProps>(), {
  as: "button",
});
</script>

<template>
  <Primitive v-bind="props" class="inline-flex items-center justify-center rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-contrast hover:bg-primary/90 h-10 px-4 py-2">
    <slot name="default" />
  </Primitive>
</template>
