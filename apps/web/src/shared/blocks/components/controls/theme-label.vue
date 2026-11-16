<script setup lang="ts">
defineProps<{ htmlFor: string }>();
</script>

<template>
  <label :for="htmlFor" class="theme-label">
    <slot />
  </label>
</template>

<style>
.theme-label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--links-theme-field-fg);
}
</style>
