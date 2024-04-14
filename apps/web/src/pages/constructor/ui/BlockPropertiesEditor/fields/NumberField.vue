<script setup lang="ts">
import { UIInput, UIInputHint, UIInputLabel, UITextArea } from "@links/ui";
import type { IBlockPropertyNumber } from "../../../core";

interface ITextFieldProps {
  field: IBlockPropertyNumber;
  id: string;
}
defineProps<ITextFieldProps>();
const model = defineModel<IBlockPropertyNumber["value"]>();
</script>

<template>
  <UIInputLabel :for="id">
    {{ field.label }}
  </UIInputLabel>
  <UIInput
    :id="id"
    v-model="model"
    full-width
    type="number"
    :min="field.min"
    :max="field.max"
    :step="field.step"
  />
  <UIInputHint v-if="field.hint">
    {{ field.hint }}
  </UIInputHint>
</template>
