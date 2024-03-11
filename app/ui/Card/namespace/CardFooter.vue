<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div class="flex items-center p-6 pt-0" :class="props.class">
    <slot />
  </div>
</template>
