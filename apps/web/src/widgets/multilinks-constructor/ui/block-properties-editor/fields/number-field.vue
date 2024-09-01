<script setup lang="ts">
import { UIButton, UIInput, UIInputHint, UIInputLabel } from "@links/ui";
import type { IBlockPropertyNumber } from "~shared/core";

interface ITextFieldProps {
  field: IBlockPropertyNumber;
  id: string;
}
const props = defineProps<ITextFieldProps>();
const model = defineModel<IBlockPropertyNumber["value"]>();

/**
 Increment or decrement field value depending on what 1 or -1 provided
 */
function stepValue(modifier: 1 | -1) {
  const newVal = (model.value ?? 0) + props.field.step * modifier;
  if (newVal <= props.field.max && newVal >= props.field.min)
    model.value = newVal;
}
</script>

<template>
  <UIInputLabel :for="id">
    {{ field.label }}
  </UIInputLabel>
  <div class="flex gap-2">
    <UIButton variant="ghost" icon="i-lucide:minus" icon-pos="right" @click="stepValue(-1)" />
    <UIInput
      :id="id"
      v-model="model"
      full-width
      type="number"
      :min="field.min"
      :max="field.max"
      :step="field.step"
    />
    <UIButton variant="ghost" icon="i-lucide:plus" icon-pos="right" @click="stepValue(1)" />
  </div>
  <UIInputHint v-if="field.hint">
    {{ field.hint }}
  </UIInputHint>
</template>
