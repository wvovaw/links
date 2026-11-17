<script setup lang="ts">
import type { IBlockPropertyDate } from "@links/blocks";

import { UIInput, UIInputHint, UIInputLabel } from "@links/ui";

interface IDateFieldProps {
  field: IBlockPropertyDate;
  id: string;
}
const props = defineProps<IDateFieldProps>();
const model = defineModel<IBlockPropertyDate["value"]>();

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * The stored value is an ISO string and the picker speaks its own dialect. A calendar date has no
 * timezone, so it is read and written as the date part alone; a date with a time is an instant, so the
 * picker shows it in the browser's timezone — the one the person choosing it is reading.
 */
function toInputValue(iso: string | undefined): string {
  if (!iso) return "";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  if (!props.field.withTime) return iso.slice(0, 10);

  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * `YYYY-MM-DD` parses as UTC midnight and `YYYY-MM-DDTHH:mm` as local time, so each direction returns
 * exactly the string the other one was given.
 */
function fromInputValue(value: string | number | undefined): string | undefined {
  if (typeof value !== "string" || !value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

const inputValue = computed({
  get: () => toInputValue(model.value),
  set: (value) => {
    model.value = fromInputValue(value);
  },
});
</script>

<template>
  <UIInputLabel :for="id">
    {{ field.label }}
  </UIInputLabel>
  <UIInput :id="id" v-model="inputValue" full-width :type="field.withTime ? 'datetime-local' : 'date'" />
  <UIInputHint v-if="field.hint">
    {{ field.hint }}
  </UIInputHint>
</template>
