<script setup lang="ts">
import { UIInput, UIInputHint, UIInputLabel } from "@links/ui";
import type { IBlockPropertyUrl } from "~core/types";

interface ITextFieldProps {
  field: IBlockPropertyUrl;
  id: string;
}
defineProps<ITextFieldProps>();
const model = defineModel<IBlockPropertyUrl["value"]>();
</script>

<template>
  <UIInputLabel :for="id">
    {{ field.label }}
  </UIInputLabel>
  <UIInput
    :id="id"
    v-model="model"
    full-width
    type="url"
  />
  <UIInputHint v-if="field.hint">
    {{ field.hint }}
  </UIInputHint>
</template>
