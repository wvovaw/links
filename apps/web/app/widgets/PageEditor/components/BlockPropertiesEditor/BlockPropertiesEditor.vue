<script setup lang="ts">
import { usePageStore } from "../../stores/page.store";
import TextField from "./fields/TextField.vue";
import NumberField from "./fields/NumberField.vue";
import SelectField from "./fields/SelectField.vue";
import UrlField from "./fields/UrlField.vue";
import ColorField from "./fields/ColorField.vue";
import BooleanField from "./fields/BooleanField.vue";
import { groupBy } from "~utils/object";

import type { BlockProperty, BlockPropertyType } from "~core/types";

const pageStore = usePageStore();
const { selectedBlock } = storeToRefs(pageStore);
const { getBlock } = pageStore;

const fieldsMap: Record<BlockPropertyType, Component> = {
  text: TextField,
  number: NumberField,
  select: SelectField,
  url: UrlField,
  color: ColorField,
  boolean: BooleanField
};
function resolveFieldsComponent(fieldType: BlockPropertyType) {
  return fieldsMap[fieldType];
};

const groupByGroupName = groupBy<BlockProperty>(["group"]);
const groupedProperties = computed(() => {
  const block = selectedBlock.value ? getBlock(selectedBlock.value) : null;
  const gp = groupByGroupName(Object.values(block?.properties ?? {}));
  return gp;
});
</script>

<template>
  <div class="p-4 space-y-2">
    <h3 class="text-moon-18 font-semibold">
      Blocks Properties
    </h3>

    <template v-if="selectedBlock">
      <template
        v-for="(group, name) of groupedProperties"
        :key="name"
      >
        <h3 class="text-trunks font-semibold">
          {{ name ? name : 'Other' }}
        </h3>
        <div
          class="w-full flex flex-col gap-2 border-(l-1 t-1 beerus) px-4 py-2"
        >
          <div
            v-for="(field, key) of group"
            :key="key"
          >
            <component
              :is="resolveFieldsComponent(field.type)"
              :id="`${name}-field-${key}`"
              v-model="field.value"
              :field="field"
            />
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
