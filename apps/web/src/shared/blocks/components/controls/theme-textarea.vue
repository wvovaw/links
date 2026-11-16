<script setup lang="ts">
withDefaults(
  defineProps<{
    id?: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    maxlength?: number;
    minlength?: number;
  }>(),
  { rows: 3 },
);

const model = defineModel<string>({ default: "" });
</script>

<template>
  <textarea
    :id="id"
    v-model="model"
    class="theme-textarea"
    :placeholder="placeholder"
    :required="required"
    :rows="rows"
    :maxlength="maxlength"
    :minlength="minlength"
  />
</template>

<style>
.theme-textarea {
  display: block;
  width: 100%;
  box-sizing: border-box;
  min-height: 4.5rem;
  padding: 0.625rem 0.875rem;
  font: inherit;
  color: var(--links-theme-field-fg);
  background: var(--links-theme-field-bg);
  border: 1px solid var(--links-theme-field-border);
  border-radius: var(--links-page-radius);
  /* Vertical only: a long message grows the block instead of widening the page. */
  resize: vertical;
  transition:
    border-color 150ms ease,
    background-color 150ms ease;
}
.theme-textarea::placeholder {
  color: var(--links-theme-field-placeholder);
  opacity: 1;
}
.theme-textarea:focus-visible {
  outline: 2px solid var(--links-page-accent);
  outline-offset: 2px;
}
</style>
