<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    class="flex flex-col gap-y-1.5 text-center sm:text-left" :class="props.class"
  >
    <slot />
  </div>
</template>
