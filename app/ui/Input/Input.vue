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
  immediateValidation?: boolean;
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
onUpdated(() => {
  if (props.error)
    setError();
});
onMounted(() => {
  if (props.immediateValidation) {
    if (props.error)
      setError();
  }
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
@import "./input.css";
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
</style>
