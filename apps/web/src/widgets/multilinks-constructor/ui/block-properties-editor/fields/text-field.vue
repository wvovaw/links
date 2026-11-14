<script setup lang="ts">
import type { IBlockPropertyText } from "@links/blocks";

import { UIInput, UIInputHint, UIInputLabel, UITextArea } from "@links/ui";

interface ITextFieldProps {
  field: IBlockPropertyText;
  id: string;
}
defineProps<ITextFieldProps>();
const model = defineModel<IBlockPropertyText["value"]>();
</script>

<template>
  <UIInputLabel :for="id">
    {{ field.label }}
  </UIInputLabel>
  <UITextArea
    v-if="field.multiline"
    :id="id"
    v-model="model"
    resize="vertical"
    :rows="3"
    :maxlength="field.maxLength"
    :minlength="field.minLength"
  />
  <UIInput
    v-else
    :id="id"
    v-model="model"
    full-width
    type="text"
    :maxlength="field.maxLength"
    :minlength="field.minLength"
  />
  <UIInputHint v-if="field.hint">
    {{ field.hint }}
  </UIInputHint>
</template>
