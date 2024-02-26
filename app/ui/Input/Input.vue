<script setup lang="ts">
import type { HTMLAttributes, InputTypeHTMLAttribute } from "vue";
import { useVModel } from "@vueuse/core";
import { type VariantProps, cva } from "cva";

const inputVariants = cva(``, {
  variants: {
    color: { piccolo: "i-piccolo", hit: "i-hit" },
    size: { sm: "i-sm", md: "i-md", lg: "i-lg" },
    fullWidth: { true: "w-full max-w-full ", false: "" },
    disabled: { true: "", false: "" },
    error: { true: "", false: "" },
  },
  compoundVariants: [],
  defaultVariants: {
    size: "md",
    color: "piccolo",
    fullWidth: false,
  },
});
type InputVariants = VariantProps<typeof inputVariants>;

// TODO: prepend and append icons
const props = withDefaults(defineProps<{
  type?: Exclude<InputTypeHTMLAttribute, "button" | "checkbox" | "color" | "file" | "hidden" | "image" | "month" | "radio" | "range" | "reset" | "submit" | "week">;
  class?: HTMLAttributes["class"];
  defaultValue?: string | number;
  modelValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  color?: InputVariants["color"];
  size?: InputVariants["size"];
  fullWidth?: boolean;
  error?: boolean;
  errorMessage?: string;
  dir?: "ltr" | "rtl";
}>(), {
  errorMessage: "Input error",
});

const emits = defineEmits<{
  "update:modelValue": [payload: string | number];
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});

const inpEl = ref<HTMLInputElement | undefined>();
function setError() {
  inpEl.value?.setCustomValidity(props.errorMessage);
  inpEl.value?.setAttribute("aria-invalid", "true");
}
function cleanError() {
  inpEl.value?.setCustomValidity("");
  inpEl.value?.removeAttribute("aria-invalid");
}
watch(() => props.error, (err) => {
  if (err)
    setError();
  else cleanError();
});
onMounted(() => {
  if (props.error)
    setError();
});
</script>

<template>
  <input
    ref="inpEl"
    v-model="modelValue"
    :class="[inputVariants({ color, size, fullWidth, disabled, error }), props.class]"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readOnly"
    :type="type"
    v-bind="$attrs"
  >
</template>

<style scoped>
input,
input:before,
input:after {
  box-sizing: border-box;
}
input {
  display: block;
  appearance: none;
  position: relative;
  z-index: 2;
  box-shadow: inset 0 0 0 1px var(--beerus);
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration:150ms;
  background: var(--goku);
  color: var(--bulma);
  padding-left: 1rem;
  padding-right: 1rem;
  margin: 0;
  @apply text-moon-16;
}
input:hover {
  box-shadow: inset 0 0 0 var(--border-i-width) var(--trunks), inset 0 0 0 var(--border-i-width) var(--beerus);
}
/* Sizes */
.i-sm {
  height: 2rem;
  @apply leading-8 rounded-moon-i-xs input-dt-shared;
}
.i-md {
  height: 2.5rem;
  @apply leading-10 rounded-moon-i-sm input-dt-shared;
 }
.i-lg {
  height: 3rem;
  @apply leading-[3rem] rounded-moon-i-sm input-lg-dt-shared;
}
/* Colors */
.i-piccolo:focus,
.i-piccolo:focus-visible {
  outline: none;
  box-shadow: 0 0 0 var(--border-i-width) var(--piccolo) inset;
}
.i-hit:focus,
.i-hit:focus-visible {
  outline: none;
  box-shadow: 0 0 0 var(--border-i-width) var(--hit) inset;
}

input::placeholder {
  animation-delay: 75ms;
  color: var(--trunks);
  opacity: 100%;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  user-select: none;
}

/* Read-only, disabled states */
input:read-only {
  outline: 0;
  border: 0;
  cursor: text;
}
input:read-only:hover,
input:read-only:focus,
input:read-only:focus-visible {
  box-shadow: 0 0 0 var(--border-width) var(--beerus) inset;
}
input:disabled {
  opacity: var(--opacity-moon);
  cursor: not-allowed;
}

/* Invalid state */
input:invalid,
input:invalid:hover,
input:invalid:focus,
input:invalid:focus-visible {
  /* color: var(--chichi); */
  box-shadow: 0 0 0 var(--border-i-width) var(--chichi) inset;
}
input:invalid::placeholder {
  color: var(--chichi-60);
}

/* Input type related styles */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}
input[type="search"]::-webkit-search-cancel-button {
  appearance: none;
  margin: 0;
}
input::-webkit-datetime-edit {
  color: var(--trunks);
  margin-right: 20px;
}
input::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 10px;
}
input[type="date"]::-webkit-calendar-picker-indicator {
  color: var(--beerus);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="rgba(153 156 160)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M8 2v4m8-4v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></g></svg>');
}
input[type="time"]::-webkit-calendar-picker-indicator {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="rgba(153 156 160)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></g></svg>');
}
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="rgba(153 156 160)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5M16 2v4M8 2v4m-5 4h5m9.5 7.5L16 16.3V14"/><circle cx="16" cy="16" r="6"/></g></svg>');
}
</style>
