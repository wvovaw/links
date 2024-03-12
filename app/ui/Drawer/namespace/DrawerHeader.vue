<script lang="ts" setup>
import type { HtmlHTMLAttributes } from "vue";

const props = defineProps<{
  class?: HtmlHTMLAttributes["class"];
}>();
</script>

<template>
  <div class="grid gap-1.5 pb-4 text-center sm:text-left" :class="props.class">
    <slot />
  </div>
</template>
