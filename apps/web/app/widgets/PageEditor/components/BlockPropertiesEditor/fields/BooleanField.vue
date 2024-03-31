<script setup lang="ts">
import { UICheckbox, UIInputHint, UIInputLabel, UISwitch } from "@links/ui";
import type { IBlockPropertyBoolean } from "~core/types";

interface ITextFieldProps {
  field: IBlockPropertyBoolean;
  id: string;
}
defineProps<ITextFieldProps>();
const model = defineModel<IBlockPropertyBoolean["value"]>();
</script>

<template>
  <div class="flex items-center gap-2">
    <label :for="id">
      {{ field.label }}
    </label>
    <UICheckbox
      v-if="field.variant === 'checkbox'"
      :id="id"
      :checked="model"
      @update:checked="v => model = v"
    />
    <UISwitch
      v-else-if="field.variant === 'switch'"
      :id="id"
      :checked="model"
      @update:checked="v => model = v"
      size="sm"
    />
  </div>
  <UIInputHint v-if="field.hint">
    {{ field.hint }}
  </UIInputHint>
</template>
