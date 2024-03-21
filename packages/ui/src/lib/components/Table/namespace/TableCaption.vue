<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <caption class="mt-4 text-moon-10-caption text-trunks" :class="props.class">
    <slot />
  </caption>
</template>
