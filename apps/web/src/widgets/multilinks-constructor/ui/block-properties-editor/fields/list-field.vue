<script setup lang="ts">
import type { BlockItemField, IBlockPropertyList, ListRow } from "@links/blocks";

import { itemFieldsOf, listRows } from "@links/blocks";
import { UIButton, UIInputHint, UIInputLabel } from "@links/ui";
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from "reka-ui";

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
 * The rows the editor has open, by position: a row is stored without an id, so a position is the only
 * name it has here. The values are strings because an accordion item's `value` is one.
 */
const openRows = ref<string[]>([]);

/** Every edit that moves a row moves its open entry with it; `undefined` drops the entry. */
function remapOpen(transform: (index: number) => number | undefined) {
  const next: string[] = [];
  for (const value of openRows.value) {
    const mapped = transform(Number(value));
    if (mapped !== undefined && !next.includes(String(mapped))) next.push(String(mapped));
  }
  openRows.value = next;
}

/**
 * A required item field says so in its label: a row that leaves it blank is one no renderer draws, so
 * the reason a card went missing is visible where the row is filled in.
 */
function markedField(itemField: BlockItemField): BlockItemField {
  return itemField.required ? { ...itemField, label: `${itemField.label} (required)` } : itemField;
}

/** What a collapsed row shows instead of its contents: the first item field that holds something. */
function summaryOf(row: ListRow): string {
  for (const itemField of itemFields.value) {
    const text = summaryValue(row[itemField.key], itemField);
    if (text) return text;
  }
  return "";
}

/**
 * An image holds the stored file's name, which is what the image field already shows beside its
 * preview — its last path segment reads as a caption where the whole storage path does not. A value
 * that is not a string (a stored number, an object from an older release) is no caption at all.
 */
function summaryValue(value: unknown, itemField: BlockItemField): string {
  if (typeof value !== "string" || value.trim() === "") return "";

  const text = value.trim();
  return itemField.type === "image" ? (text.split("/").pop() ?? text) : text;
}

/**
 * The required item fields this row has not filled in. The check mirrors the private `hasContent` in
 * `packages/blocks/src/list.ts`, which answers the same question for a renderer.
 */
function blankRequiredOf(row: ListRow): string[] {
  return itemFields.value
    .filter((itemField) => itemField.required && !hasContent(row[itemField.key]))
    .map((itemField) => itemField.label);
}

function hasContent(value: unknown): boolean {
  if (typeof value === "string") return value.trim() !== "";
  return value !== undefined && value !== null;
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

  // The new row's position is read before the write: a `defineModel` setter only reaches this
  // component's `rows` again once the prop comes back down.
  const index = rows.value.length;
  setRows([...rows.value, defaultRow()]);
  openRows.value = [...openRows.value, String(index)];
}

function duplicateRow(index: number) {
  if (rows.value.length >= maximumItems.value) return;
  const copy = { ...rows.value[index] };
  setRows([...rows.value.slice(0, index + 1), copy, ...rows.value.slice(index + 1)]);
  remapOpen((position) => (position > index ? position + 1 : position));
  openRows.value = [...openRows.value, String(index + 1)];
}

function removeRow(index: number) {
  if (rows.value.length <= minimumItems.value) return;
  setRows(rows.value.filter((_, position) => position !== index));
  remapOpen((position) => (position === index ? undefined : position > index ? position - 1 : position));
}

/** The moved row keeps its open state: the two positions swap their entries. */
function moveRow(index: number, offset: -1 | 1) {
  const target = index + offset;
  if (target < 0 || target >= rows.value.length) return;

  const next = [...rows.value];
  [next[index], next[target]] = [next[target]!, next[index]!];
  setRows(next);
  remapOpen((position) => (position === index ? target : position === target ? index : position));
}

/** Always a new array and a new row object, so the stored block is replaced rather than mutated. */
function setRowValue(index: number, key: string, value: unknown) {
  setRows(rows.value.map((row, position) => (position === index ? { ...row, [key]: value } : row)));
}
</script>

<template>
  <UIInputLabel :for="id">
    {{ field.label }}
  </UIInputLabel>
  <p v-if="rows.length === 0" class="text-moon-14 text-trunks">No rows yet — add the first one.</p>
  <div class="w-full flex flex-col gap-2">
    <AccordionRoot v-model="openRows" type="multiple">
      <AccordionItem
        v-for="(row, index) of rows"
        :key="index"
        :value="String(index)"
        data-testid="list-row"
        class="border border-beerus rounded-moon-i-sm"
      >
        <div class="flex items-center gap-2 p-2">
          <AccordionHeader as="div" class="flex-1 min-w-0">
            <AccordionTrigger
              data-testid="list-row-toggle"
              class="group w-full min-w-0 flex items-center gap-2 cursor-pointer text-start"
            >
              <span
                class="i-lucide:chevron-down h-4 w-4 shrink-0 text-trunks transition-transform group-data-[state=open]:rotate-180"
              />
              <span class="shrink-0 text-moon-14 text-trunks">Row {{ index + 1 }}</span>
              <span v-if="summaryOf(row)" data-testid="list-row-summary" class="truncate text-moon-14 text-bulma">
                {{ summaryOf(row) }}
              </span>
              <span
                v-if="blankRequiredOf(row).length"
                data-testid="list-row-required"
                class="shrink-0 text-moon-12 text-chichi"
              >
                Required: {{ blankRequiredOf(row).join(", ") }}
              </span>
            </AccordionTrigger>
          </AccordionHeader>
          <div class="ml-auto flex items-center gap-1 shrink-0">
            <UIButton
              data-testid="list-move-up"
              variant="ghost"
              size="sm"
              icon="i-lucide:arrow-up"
              aria-label="Move row up"
              :disabled="index === 0"
              @click="moveRow(index, -1)"
            />
            <UIButton
              data-testid="list-move-down"
              variant="ghost"
              size="sm"
              icon="i-lucide:arrow-down"
              aria-label="Move row down"
              :disabled="index === rows.length - 1"
              @click="moveRow(index, 1)"
            />
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
        <AccordionContent class="p-2 pt-0 flex flex-col gap-2">
          <component
            :is="scalarFields[itemField.type]"
            v-for="itemField of itemFields"
            :key="itemField.key"
            :id="`${id}-row-${index}-${itemField.key}`"
            :field="markedField(itemField)"
            :model-value="row[itemField.key]"
            @update:model-value="(value: unknown) => setRowValue(index, itemField.key, value)"
          />
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
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
