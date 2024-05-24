<script setup lang="ts">
defineProps<{
  icon: string;
}>();
</script>

<template>
  <button
    class="h-10 w-10 flex items-center justify-center rounded-full bg-zeno text-goten outline-beerus"
  >
    <div :class="icon" />
  </button>
</template>
