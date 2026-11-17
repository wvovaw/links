<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: "submit" | "button";
    disabled?: boolean;
    loading?: boolean;
  }>(),
  { type: "submit" },
);
</script>

<template>
  <button :type="type" class="theme-button" :disabled="disabled || loading" :aria-busy="loading || undefined">
    <slot />
  </button>
</template>

<style>
.theme-button {
  display: flex;
  width: 100%;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0.75rem 1rem;
  font: inherit;
  font-weight: 600;
  color: var(--links-theme-button-fg);
  background: var(--links-theme-button-bg);
  border: var(--links-theme-button-border-width, 0) solid var(--links-theme-button-border, transparent);
  border-radius: var(--links-page-radius);
  cursor: pointer;
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
.theme-button:focus-visible {
  outline: 2px solid var(--links-page-accent);
  outline-offset: 2px;
}
.theme-button:active:not(:disabled) {
  transform: scale(0.98);
}
.theme-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
