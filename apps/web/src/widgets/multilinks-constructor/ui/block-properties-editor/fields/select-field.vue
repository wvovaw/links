<script setup lang="ts">
import type { IBlockPropertySelect, IBlockPropertySelectMultiple } from "@links/blocks";

import { UICheckbox, UIRichSelect, UISelectHint, UISelectLabel } from "@links/ui";

interface ISelectFieldProps {
  field: IBlockPropertySelect | IBlockPropertySelectMultiple;
  id: string;
}
const props = defineProps<ISelectFieldProps>();
const model = defineModel<IBlockPropertySelect["value"] | string[]>();

/**
 * The values a multiple select has ticked. A property the owner never touched has no value yet, so the
 * schema's default is what the checklist shows until it is changed.
 */
const selected = computed<string[]>(() => {
  if (Array.isArray(model.value)) return model.value;
  return props.field.isMultiple && Array.isArray(props.field.defaultValue) ? props.field.defaultValue : [];
});

/** A single select keeps its one value; an array is not one of the values it can hold. */
const single = computed({
  get: () => (Array.isArray(model.value) ? undefined : model.value),
  /* The select hands back a number for a numeric option; a stored block keeps its values as text. */
  set: (value: string | number | undefined) => (model.value = typeof value === "number" ? String(value) : value),
});

function toggle(value: string) {
  if (selected.value.includes(value)) model.value = selected.value.filter((chosen) => chosen !== value);
  else model.value = [...selected.value, value];
}
</script>

<template>
  <UISelectLabel :for="id">
    {{ field.label }}
  </UISelectLabel>
  <div v-if="field.isMultiple" :id="id" class="flex flex-col gap-2 pb-2">
    <label
      v-for="option of field.options"
      :key="option.value"
      class="flex cursor-pointer items-center gap-2 text-moon-14"
    >
      <UICheckbox :model-value="selected.includes(option.value)" @update:model-value="toggle(option.value)" />
      <span>{{ option.label }}</span>
    </label>
  </div>
  <UIRichSelect.Root v-else v-model="single">
    <UIRichSelect.Trigger>
      <UIRichSelect.Value />
    </UIRichSelect.Trigger>
    <UIRichSelect.Content>
      <UIRichSelect.Item v-for="option of field.options" :key="option.label" :value="option.value">
        {{ option.label }}
      </UIRichSelect.Item>
    </UIRichSelect.Content>
  </UIRichSelect.Root>
  <UISelectHint v-if="field.hint">
    {{ field.hint }}
  </UISelectHint>
</template>
