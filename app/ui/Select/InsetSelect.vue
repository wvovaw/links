<script setup lang="ts">
import type { HTMLAttributes, SelectHTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { type VariantProps, cva } from "cva";

const insertSelectVariants = cva("s-insert", {
  variants: {
    color: { piccolo: "s-piccolo", hit: "s-hit" },
    disabled: { true: "", false: "" },
    error: { true: "", false: "" },
  },
  compoundVariants: [],
  defaultVariants: {
    color: "piccolo",
  },
});
type InsertSelectVariants = VariantProps<typeof insertSelectVariants>;

const props = withDefaults(defineProps<{
  class?: HTMLAttributes["class"];
  modelValue?: string | number;
  label?: string;
  disabled?: boolean;
  multiple?: boolean;
  color?: InsertSelectVariants["color"];
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
  <div class="block relative w-full max-w-full rounded-moon-i-sm">
    <select
      ref="selEl"
      v-model="modelValue"
      :class="[insertSelectVariants({ color, disabled, error }), props.class]"
      :disabled="disabled"
      :multiple="multiple"
      v-bind="$attrs"
    >
      <slot />
    </select>
    <label class="absolute text-trunks transition-all ease-in-out duration-200 start-4 text-moon-12 top-3 pointer-events-none z-[2]">{{ label }}</label>
    <span class="i-lucide:chevron-down absolute top-1/2 end-3 -translate-y-1/2 z-5 pointer-events-none text-trunks flex-shrink-0 transition-transform text-moon-20" />
  </div>
</template>

<style scoped>
@import "select.css";
select {
  display: unset;
  max-width: unset;
  width: 100%;
}
select:before,select:after {
  box-sizing: unset;
}
</style>
