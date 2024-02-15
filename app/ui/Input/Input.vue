<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <input v-model="modelValue" class="flex h-10 w-full rounded-md border border-fg/50 bg-bg px-3 py-2 text-sm ring-offset-bg file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-fg/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" :class="[props.class]">
</template>
