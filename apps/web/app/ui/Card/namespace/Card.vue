<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    class="rounded-moon-s-lg border border-beerus bg-gohan text-bulma shadow-moon-md"
    :class="props.class"
  >
    <slot />
  </div>
</template>
