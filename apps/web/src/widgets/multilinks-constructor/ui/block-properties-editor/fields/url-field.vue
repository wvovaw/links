<script setup lang="ts">
import type { IBlockPropertyUrl } from "@links/blocks";

import { UIInput, UIInputHint, UIInputLabel } from "@links/ui";

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
  <UIInput :id="id" v-model="model" full-width type="url" />
  <UIInputHint v-if="field.hint">
    {{ field.hint }}
  </UIInputHint>
</template>
