<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <tr class="border-b border-beerus transition-colors hover:bg-heles data-[state=selected]:bg-heles" :class="props.class">
    <slot />
  </tr>
</template>
