<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <span class="i-lucide:loader-circle animate-spin" :class="props.class" />
</template>
