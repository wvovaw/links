<script setup lang="ts">
defineProps<{
  error?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <p
    class="w-full flex gap-1 items-center mt-2 ml-2 text-moon-12 [&_svg]:text-moon-16"
    :class="{
      'opacity-60 cursor-not-allowed': disabled,
      'text-chichi': error,
      'text-trunks': !error,
    }"
  >
    <slot />
  </p>
</template>
