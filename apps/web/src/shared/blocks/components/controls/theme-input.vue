<script setup lang="ts">
withDefaults(
  defineProps<{
    id?: string;
    type?: "text" | "email";
    placeholder?: string;
    required?: boolean;
    maxlength?: number;
    minlength?: number;
  }>(),
  { type: "text" },
);

const model = defineModel<string>({ default: "" });
</script>

<template>
  <input
    :id="id"
    v-model="model"
    class="theme-input"
    :type="type"
    :placeholder="placeholder"
    :required="required"
    :maxlength="maxlength"
    :minlength="minlength"
  />
</template>

<style>
.theme-input {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 0.625rem 0.875rem;
  font: inherit;
  color: var(--links-theme-field-fg);
  background: var(--links-theme-field-bg);
  border: 1px solid var(--links-theme-field-border);
  border-radius: var(--links-page-radius);
  transition:
    border-color 150ms ease,
    background-color 150ms ease;
}
.theme-input::placeholder {
  color: var(--links-theme-field-placeholder);
  opacity: 1;
}
.theme-input:focus-visible {
  outline: 2px solid var(--links-page-accent);
  outline-offset: 2px;
}
</style>
