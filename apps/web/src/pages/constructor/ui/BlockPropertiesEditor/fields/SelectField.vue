<script setup lang="ts">
import { UIRichSelect, UISelectHint, UISelectLabel, UITextArea } from "@links/ui";
import type { IBlockPropertySelect } from "../../../core";

interface ITextFieldProps {
  field: IBlockPropertySelect;
  id: string;
}
defineProps<ITextFieldProps>();
const model = defineModel<IBlockPropertySelect["value"]>();
</script>

<template>
  <UISelectLabel :for="id">
    {{ field.label }}
  </UISelectLabel>
  <UIRichSelect.Root v-model="model">
    <UIRichSelect.Trigger>
      <UIRichSelect.Value />
    </UIRichSelect.Trigger>
    <UIRichSelect.Content>
      <UIRichSelect.Item
        v-for="option of field.options"
        :key="option.label"
        :value="option.value"
      >
        {{ option.label }}
      </UIRichSelect.Item>
    </UIRichSelect.Content>
  </UIRichSelect.Root>
  <UISelectHint v-if="field.hint">
    {{ field.hint }}
  </UISelectHint>
</template>
