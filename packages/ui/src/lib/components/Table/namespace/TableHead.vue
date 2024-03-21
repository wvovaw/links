<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <th class="h-12 px-4 text-left align-middle font-bold text-trunks [&:has([role=checkbox])]:pr-0" :class="props.class">
    <slot />
  </th>
</template>
