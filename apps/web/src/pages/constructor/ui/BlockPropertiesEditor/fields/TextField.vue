<script setup lang="ts">
import { UIInput, UIInputHint, UIInputLabel, UITextArea } from "@links/ui";
import type { IBlockPropertyText } from "../../../core";

interface ITextFieldProps {
  field: IBlockPropertyText;
  id: string;
}
defineProps<ITextFieldProps>();
const model = defineModel<IBlockPropertyText["value"]>();
</script>

<template>
  <!-- TODO: implement min/max length -->
  <UIInputLabel :for="id">
    {{ field.label }}
  </UIInputLabel>
  <UITextArea
    v-if="field.multiline"
    :id="id"
    v-model="model"
    resize="vertical"
    :rows="3"
  />
  <UIInput
    v-else
    :id="id"
    v-model="model"
    full-width
    type="text"
  />
  <UIInputHint v-if="field.hint">
    {{ field.hint }}
  </UIInputHint>
</template>
