<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  icon: string;
}>();
</script>

<template>
  <span class="text-moon-20 mx-1" :class="[icon, props.class]" />
</template>
