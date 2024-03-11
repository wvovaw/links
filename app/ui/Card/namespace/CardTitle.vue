<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <h5
    class="text-moon-24 font-semibold leading-none tracking-tight" :class="props.class"
  >
    <slot />
  </h5>
</template>
