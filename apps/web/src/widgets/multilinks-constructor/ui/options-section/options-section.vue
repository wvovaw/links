<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <section
    class="p-3"
  >
    <h3 class="text-trunks font-semibold">
      {{ title }}
    </h3>
    <div
      class="w-full flex flex-col gap-2 py-2"
    >
      <slot />
    </div>
  </section>
</template>
