<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <p class="text-moon-14 text-trunks" :class="props.class">
    <slot />
  </p>
</template>
