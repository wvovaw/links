<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { ToastClose, type ToastCloseProps } from "radix-vue";
import { UIButton } from "../../Button";

const props = defineProps<ToastCloseProps & {
  class?: HTMLAttributes["class"];
}>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <ToastClose
    v-bind="delegatedProps"
    as-child
  >
    <UIButton
      class="absolute! rounded-full! right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity! duration-300 ease-in"
      :class="props.class"
      icon="i-lucide:x"
      variant="ghost"
      size="xs"
    />
  </ToastClose>
</template>
