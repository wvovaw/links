<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { ToastAction, type ToastActionProps } from "radix-vue";

const props = defineProps<ToastActionProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <ToastAction
    v-bind="delegatedProps"
    class="inline-flex h-8 shrink-0 items-center justify-center rounded-moon-i-md border border-beerus bg-transparent px-3 text-moon-14 font-medium outline-none transition-colors hover:bg-gohan focus:outline-none focus:ring-1 focus:ring-bulma disabled:pointer-events-none disabled:opacity-50"
    :class="props.class"
  >
    <slot />
  </ToastAction>
</template>
