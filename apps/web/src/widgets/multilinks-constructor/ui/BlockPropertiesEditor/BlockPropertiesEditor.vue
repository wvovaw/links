<script setup lang="ts">
import { UIButton, UISeparator } from "@links/ui";
import { useConstructorStore } from "../../model";
import TextField from "./fields/TextField.vue";
import NumberField from "./fields/NumberField.vue";
import SelectField from "./fields/SelectField.vue";
import UrlField from "./fields/UrlField.vue";
import ColorField from "./fields/ColorField.vue";
import BooleanField from "./fields/BooleanField.vue";
import type { BlockProperty, BlockPropertyType } from "~shared/core";
import { groupBy } from "~/shared/lib/utils";

const constructorStore = useConstructorStore();
const { selectedBlockId } = storeToRefs(constructorStore);
const { getBlock, removeBlock } = constructorStore;

const fieldsMap: Record<BlockPropertyType, Component> = {
  text: TextField,
  number: NumberField,
  select: SelectField,
  url: UrlField,
  color: ColorField,
  boolean: BooleanField,
};
function resolveFieldsComponent(fieldType: BlockPropertyType) {
  return fieldsMap[fieldType];
};

const groupByGroupName = groupBy<BlockProperty>(["group"]);
const groupedProperties = computed(() => {
  const block = selectedBlockId.value ? getBlock(selectedBlockId.value) : null;
  const gp = groupByGroupName(Object.values(block?.properties ?? {}));
  return gp;
});
</script>

<template>
  <h3 class="ml-3 mt-3 text-moon-18 font-semibold">
    Block Properties
  </h3>

  <template v-if="selectedBlockId">
    <template
      v-for="(group, name) of groupedProperties"
      :key="name"
    >
      <section
        class="p-3"
      >
        <h3 class="text-trunks font-semibold">
          {{ name ? name : 'Other' }}
        </h3>
        <div
          class="w-full flex flex-col gap-2 py-2"
        >
          <div
            v-for="field of group"
            :key="field.id"
          >
            <component
              :is="resolveFieldsComponent(field.type)"
              :id="`${name}-field-${field.id}`"
              v-model="field.value"
              :field="field"
            />
          </div>
        </div>
      </section>
      <UISeparator />
    </template>
    <div class="p-3">
      <UIButton
        full-width
        variant="outline"
        color="chichi"
        icon="i-lucide:trash-2"
        icon-pos="left"
        @click="removeBlock(selectedBlockId)"
      >
        Delete
      </UIButton>
    </div>
  </template>
</template>
