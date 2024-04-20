<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { ToastDescription, type ToastDescriptionProps } from "radix-vue";

const props = defineProps<ToastDescriptionProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <ToastDescription
    v-bind="delegatedProps"
    class="text-moon-14 text-trunks"
    :class="props.class"
  >
    <slot />
  </ToastDescription>
</template>
