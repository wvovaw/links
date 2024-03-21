<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <tfoot class="border-t border-beerus font-semibold [&>tr]:last:border-b-0" :class="props.class">
    <slot />
  </tfoot>
</template>
