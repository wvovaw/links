<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <span class="ml-auto text-moon-i-12 tracking-widest opacity-60" :class="[props.class]">
    <slot />
  </span>
</template>
