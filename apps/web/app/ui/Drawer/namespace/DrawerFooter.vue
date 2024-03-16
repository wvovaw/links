<script lang="ts" setup>
import type { HtmlHTMLAttributes } from "vue";

const props = defineProps<{
  class?: HtmlHTMLAttributes["class"];
}>();
</script>

<template>
  <div class="mt-auto flex flex-col gap-2 pt-4 pb-2" :class="props.class">
    <slot />
  </div>
</template>
