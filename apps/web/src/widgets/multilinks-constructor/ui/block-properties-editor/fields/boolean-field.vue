<script setup lang="ts">
import type { IBlockPropertyBoolean } from "@links/blocks";

import { UICheckbox, UIInputHint, UISwitch } from "@links/ui";

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
    <UICheckbox v-if="field.variant === 'checkbox'" :id="id" v-model="model" />
    <UISwitch v-else-if="field.variant === 'switch'" :id="id" v-model="model" size="sm" />
  </div>
  <UIInputHint v-if="field.hint">
    {{ field.hint }}
  </UIInputHint>
</template>
