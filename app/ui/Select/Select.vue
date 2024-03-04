<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { type VariantProps, cva } from "cva";

const selectVariants = cva("", {
  variants: {
    color: { piccolo: "s-piccolo", hit: "s-hit" },
    size: { sm: "s-sm", md: "s-md", lg: "s-lg" },
    disabled: { true: "", false: "" },
    error: { true: "", false: "" },
  },
  compoundVariants: [],
  defaultVariants: {
    size: "md",
    color: "piccolo",
  },
});
const arrowVariants = cva("i-lucide:chevron-down", {
  variants: {
    size: {
      sm: "absolute top-1/2 end-3 -translate-y-1/2 z-5 pointer-events-none text-trunks flex-shrink-0 transition-transform text-moon-16",
      md: "absolute top-1/2 end-3 -translate-y-1/2 z-5 pointer-events-none text-trunks flex-shrink-0 transition-transform text-moon-16",
      lg: "absolute top-1/2 end-3 -translate-y-1/2 z-5 pointer-events-none text-trunks flex-shrink-0 transition-transform text-moon-16",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
type SelectVariants = VariantProps<typeof selectVariants>;

const props = withDefaults(defineProps<{
  class?: HTMLAttributes["class"];
  modelValue?: string | number;
  disabled?: boolean;
  multiple?: boolean;
  color?: SelectVariants["color"];
  size?: SelectVariants["size"];
  error?: boolean;
  errorMessage?: string;
  dir?: "ltr" | "rtl";
}>(), {
  errorMessage: "Select error",
});

const emits = defineEmits<{
  "update:modelValue": [payload: string | number];
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
});

const selEl = ref<HTMLSelectElement | undefined>();
function setError() {
  selEl.value?.setCustomValidity(props.errorMessage);
  selEl.value?.setAttribute("aria-invalid", "true");
}
function cleanError() {
  selEl.value?.setCustomValidity("");
  selEl.value?.removeAttribute("aria-invalid");
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
  <span class="block relative h-full w-full max-w-full">
    <select
      ref="selEl"
      v-model="modelValue"
      :class="[selectVariants({ color, size, disabled, error }), props.class]"
      :disabled="disabled"
      :multiple="multiple"
      v-bind="$attrs"
    >
      <slot />
    </select>
    <span :class="arrowVariants({ size })" />

  </span>
</template>

<style scoped>
@import "select.css";
</style>
