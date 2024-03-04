<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  title: string;
  subtitle: string;
}>();
</script>

<template>
  <span class="block grow text-start text-bulma overflow-hidden" :class="props.class">
    <span class="block text-bulma text-moon-14">{{ title }}</span>
    <span class="flex text-trunks text-moon-12">
      <span class="flex-1 truncate">{{ subtitle }}</span>
    </span>
  </span>
</template>
