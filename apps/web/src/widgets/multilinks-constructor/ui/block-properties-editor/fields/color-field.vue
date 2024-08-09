<script setup lang="ts">
import { UIInput, UIInputHint, UIInputLabel } from "@links/ui";
import type { IBlockPropertyColor } from "~shared/core";

interface IColorFieldProps {
  field: IBlockPropertyColor;
  id: string;
}
defineProps<IColorFieldProps>();
const model = defineModel<IBlockPropertyColor["value"]>();
const debounce = useDebounceFn((f: () => void) => f(), 200);
</script>

<template>
  <UIInputLabel :for="id">
    {{ field.label }}
  </UIInputLabel>
  <div class="flex flex-row gap-1">
    <input
      :model-value="model"
      :value="model"
      type="color"
      @input="(e) => debounce(() => model = (e.target as HTMLInputElement).value)"
    >
    <UIInput
      :id="id"
      v-model="model"
      type="text"
      full-width
    />
  </div>
  <UIInputHint v-if="field.hint">
    {{ field.hint }}
  </UIInputHint>
</template>

<style>
input[type="color"] {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  background: none;
  border: 0;
  cursor: pointer;
  box-sizing: border-box;
  height: 100%;
  aspect-ratio: 1/1;
  border: 1px solid var(--beerus);
  border-radius: var(--radius-i-sm);
  overflow: hidden;
}
::-webkit-color-swatch-wrapper {
  padding: 0;
}
::-webkit-color-swatch{
  border: 0;
  border-radius: 0;
}
::-moz-color-swatch,
::-moz-focus-inner{
  border: 0;
}
::-moz-focus-inner{
  padding: 0;
}
</style>
