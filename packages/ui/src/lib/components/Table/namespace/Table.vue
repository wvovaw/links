<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div class="relative w-full overflow-auto">
    <table class="w-full caption-bottom text-moon-14" :class="props.class">
      <slot />
    </table>
  </div>
</template>
