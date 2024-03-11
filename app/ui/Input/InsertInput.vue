<script setup lang="ts">
import { useId } from "radix-vue";
import type { HTMLAttributes, InputTypeHTMLAttribute } from "vue";
import { useVModel } from "@vueuse/core";
import { type VariantProps, cva } from "cva";

const insertInputVariants = cva("h-[3.5rem] leading-[3.5rem] rounded-moon-i-sm input-dt-shared pt-[1.25rem]", {
  variants: {
    color: { piccolo: "i-piccolo", hit: "i-hit" },
    fullWidth: { true: "w-full max-w-full ", false: "" },
    disabled: { true: "", false: "" },
    error: { true: "", false: "" },
  },
  compoundVariants: [],
  defaultVariants: {
    color: "piccolo",
    fullWidth: false,
  },
});
type InsertInputVariants = VariantProps<typeof insertInputVariants>;

// TODO: prepend and append icons
const props = withDefaults(defineProps<{
  type?: Exclude<InputTypeHTMLAttribute, "button" | "checkbox" | "color" | "file" | "hidden" | "image" | "month" | "radio" | "range" | "reset" | "submit" | "week">;
  class?: HTMLAttributes["class"];
  defaultValue?: string | number;
  modelValue?: string | number;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  color?: InsertInputVariants["color"];
  fullWidth?: boolean;
  error?: boolean;
  errorMessage?: string;
  immediateValidation?: boolean;
  dir?: "ltr" | "rtl";
}>(), {
  errorMessage: "InsertInput error",
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
const id = useId();
</script>

<template>
  <div class="relative rounded-moon-i-sm bg-goku" :class="{ 'w-full': fullWidth }">
    <input
      v-bind="$attrs"
      :id="id"
      ref="inpEl"
      v-model="modelValue"
      :class="[insertInputVariants({ color, fullWidth, disabled, error }), props.class]"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readOnly"
      :type="type"
    >
    <label :for="id" class="absolute text-moon-12 text-trunks top-3 start-4 z-[1] cursor-inherit transition-all">{{ label }}</label>
  </div>
</template>

<style scoped>
@import "./input.css";
input {
  display: unset;
  max-width: unset;
  width: 100%;
}
input:before,input:after {
  box-sizing: unset;
}
input:not(:focus):not([disabled]):placeholder-shown+label {
    top: 50%;
    margin-top: -0.438rem;
    font-size: 1rem;
    line-height: 1rem;
}
input::placeholder {
  opacity: 1000%;
}
input:not(:focus):not([disabled])::placeholder {
  opacity: 0%;
}
</style>
