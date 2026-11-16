<script setup lang="ts">
import { UIButton } from "@links/ui";

defineProps<{
  edge: "top" | "bottom";
}>();

const emit = defineEmits<{ insert: [] }>();
</script>

<template>
  <div
    class="pointer-events-none absolute inset-x-0 z-2 flex justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100 max-md:opacity-100"
    :class="edge === 'top' ? '-top-3' : '-bottom-3'"
  >
    <UIButton
      icon="i-lucide:plus"
      size="xs"
      class="pointer-events-auto rounded-full! shadow-moon-lg"
      aria-label="Add a block here"
      data-testid="insert-block"
      @click="emit('insert')"
    />
  </div>
</template>
