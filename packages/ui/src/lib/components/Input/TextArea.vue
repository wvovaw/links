<script setup lang="ts">
import { type HTMLAttributes, onMounted, ref, watch } from "vue";
import { useVModel } from "@vueuse/core";
import { type VariantProps, cva } from "cva";

const textAreaVariants = cva("", {
  variants: {
    color: { piccolo: "i-piccolo", hit: "i-hit" },
    resize: {
      horizontal: "resize-x",
      vertical: "resize-y",
      both: "resize",
      none: "resize-none",
    },
    disabled: { true: "", false: "" },
    error: { true: "", false: "" },
  },
  compoundVariants: [],
  defaultVariants: {
    color: "piccolo",
  },
});
type TextAreaVariants = VariantProps<typeof textAreaVariants>;

const props = withDefaults(defineProps<{
  class?: HTMLAttributes["class"];
  defaultValue?: string;
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  color?: TextAreaVariants["color"];
  error?: boolean;
  errorMessage?: string;
  resize?: TextAreaVariants["resize"];
  rows?: number;
  dir?: "ltr" | "rtl";
}>(), {
  errorMessage: "Input error",
  resize: "both",
  rows: 2,
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
  <textarea
    ref="inpEl"
    v-model="modelValue"
    :class="[textAreaVariants({ color, resize, disabled, error }), props.class]"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readOnly"
    :rows="rows"
    v-bind="$attrs"
  />
</template>

<style scoped>
@import "./input.css";
textarea {
  @apply w-full p-4 leading-6 rounded-moon-i-sm input-dt-shared;
}
</style>
