<script setup lang="ts">
defineProps<{
  linkId: string;
}>();
</script>

<template>
  <div class="absolute bottom-4 right-4">
    <div class="flex flex-col items-center rounded-moon-s-sm bg-heles p-2 text-moon-14 text-goten">
      <span>
        {{ linkId }}
      </span>
      <span>page preview</span>
    </div>
  </div>
</template>
