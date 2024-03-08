<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  icon: string;
}>();
</script>

<template>
  <span class="block text-moon-14 mr-1" :class="[icon, props.class]" />
</template>
