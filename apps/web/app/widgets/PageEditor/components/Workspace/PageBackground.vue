<script setup lang="ts">
interface IPageBackgroundProps {
}
defineProps<IPageBackgroundProps>();
</script>

<template>
  <div class="w-full grow from-pink-300 via-purple-300 to-indigo-400 bg-gradient-to-t py-10">
    <slot />
  </div>
</template>
