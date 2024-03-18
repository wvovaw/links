<script setup lang="ts">
import type { HtmlHTMLAttributes } from "vue";

const props = defineProps<{
  class?: HtmlHTMLAttributes["class"];
}>();
</script>

<template>
  <div
    :class="props.class"
    class="animate-pulse rounded-md bg-heles"
  />
</template>
