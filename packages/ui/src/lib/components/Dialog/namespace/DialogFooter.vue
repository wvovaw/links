<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div
    class="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2" :class="props.class"
  >
    <slot />
  </div>
</template>
