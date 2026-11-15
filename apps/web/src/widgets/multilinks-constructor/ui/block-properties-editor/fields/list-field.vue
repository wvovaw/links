<script setup lang="ts">
import type { BlockItemField, IBlockPropertyList, ListRow } from "@links/blocks";

import { animations, dragAndDrop, tearDown } from "@formkit/drag-and-drop";
import { itemFieldsOf, listRows } from "@links/blocks";
import { UIButton, UIInputHint, UIInputLabel } from "@links/ui";

import { scalarFields } from "./scalars";

interface IListFieldProps {
  field: IBlockPropertyList;
  id: string;
}
const props = defineProps<IListFieldProps>();
const model = defineModel<IBlockPropertyList["value"]>();

const rows = computed(() => listRows({ ...props.field, value: model.value }));
const itemFields = computed(() => itemFieldsOf(props.field));
const minimumItems = computed(() => props.field.minItems ?? 0);
const maximumItems = computed(() => props.field.maxItems ?? Number.POSITIVE_INFINITY);

/**
 * A required item field says so in its label: a row that leaves it blank is one no renderer draws, so
 * the reason a card went missing is visible where the row is filled in.
 */
function markedField(itemField: BlockItemField): BlockItemField {
  return itemField.required ? { ...itemField, label: `${itemField.label} (required)` } : itemField;
}

/** A new row is the declared defaults under the item fields' keys, nothing invented. */
function defaultRow(): ListRow {
  const entries = itemFields.value.map((item): [string, unknown] => [item.key, item.defaultValue]);
  return Object.fromEntries(entries);
}

function setRows(next: ListRow[]) {
  model.value = next;
}

function addRow() {
  if (rows.value.length >= maximumItems.value) return;
  setRows([...rows.value, defaultRow()]);
}

function duplicateRow(index: number) {
  if (rows.value.length >= maximumItems.value) return;
  const copy = { ...rows.value[index] };
  setRows([...rows.value.slice(0, index + 1), copy, ...rows.value.slice(index + 1)]);
}

function removeRow(index: number) {
  if (rows.value.length <= minimumItems.value) return;
  setRows(rows.value.filter((_, position) => position !== index));
}

/** Always a new array and a new row object, so the stored block is replaced rather than mutated. */
function setRowValue(index: number, key: string, value: unknown) {
  setRows(rows.value.map((row, position) => (position === index ? { ...row, [key]: value } : row)));
}

const rowsRoot = ref<HTMLElement>();

onMounted(() => {
  if (!rowsRoot.value) return;

  dragAndDrop<ListRow>({
    parent: rowsRoot.value,
    getValues: () => rows.value,
    setValues: (values) => setRows(values),
    config: {
      dragHandle: "[data-testid='list-drag']",
      plugins: [animations({ duration: 100 })],
    },
  });
});

onBeforeUnmount(() => {
  if (rowsRoot.value) tearDown(rowsRoot.value);
});
</script>

<template>
  <UIInputLabel :for="id">
    {{ field.label }}
  </UIInputLabel>
  <p v-if="rows.length === 0" class="text-moon-14 text-trunks">No rows yet — add the first one.</p>
  <div ref="rowsRoot" class="w-full flex flex-col gap-2">
    <div
      v-for="(row, index) of rows"
      :key="index"
      data-testid="list-row"
      class="flex flex-col gap-2 border border-beerus rounded-moon-i-sm p-2"
    >
      <div class="flex items-center gap-2">
        <span data-testid="list-drag" class="i-lucide:grip-vertical h-5 w-5 cursor-grab text-trunks" />
        <span class="text-moon-14 text-trunks">Row {{ index + 1 }}</span>
        <div class="ml-auto flex items-center gap-1">
          <UIButton
            data-testid="list-duplicate"
            variant="ghost"
            size="sm"
            icon="i-lucide:copy"
            aria-label="Duplicate row"
            :disabled="rows.length >= maximumItems"
            @click="duplicateRow(index)"
          />
          <UIButton
            data-testid="list-remove"
            variant="ghost"
            size="sm"
            icon="i-lucide:trash-2"
            aria-label="Remove row"
            :disabled="rows.length <= minimumItems"
            @click="removeRow(index)"
          />
        </div>
      </div>
      <component
        :is="scalarFields[itemField.type]"
        v-for="itemField of itemFields"
        :key="itemField.key"
        :id="`${id}-row-${index}-${itemField.key}`"
        :field="markedField(itemField)"
        :model-value="row[itemField.key]"
        @update:model-value="(value: unknown) => setRowValue(index, itemField.key, value)"
      />
    </div>
  </div>
  <UIButton
    data-testid="list-add"
    variant="outline"
    icon="i-lucide:plus"
    :disabled="rows.length >= maximumItems"
    @click="addRow"
  >
    Add row
  </UIButton>
  <UIInputHint v-if="field.hint">
    {{ field.hint }}
  </UIInputHint>
</template>
