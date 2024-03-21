<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <tbody class="[&_tr:last-child]:border-0" :class="[props.class]">
    <slot />
  </tbody>
</template>
