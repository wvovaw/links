<script setup lang="ts">
import { UIButton, UISeparator } from "@links/ui";
import { useConstructorStore } from "../../model";
import { OptionsSection } from "../options-section";
import TextField from "./fields/text-field.vue";
import NumberField from "./fields/number-field.vue";
import SelectField from "./fields/select-field.vue";
import UrlField from "./fields/url-field.vue";
import ColorField from "./fields/color-field.vue";
import BooleanField from "./fields/boolean-field.vue";
import type { BlockProperty, BlockPropertyType } from "~shared/core";
import { groupBy } from "~/shared/lib/utils";
import { SpiralArrow } from "~shared/ui/doodles";

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
  <template v-if="selectedBlockId">
    <template
      v-for="(group, name) of groupedProperties"
      :key="name"
    >
      <OptionsSection :title="name ? name : 'Other'">
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
      </OptionsSection>
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
  <div v-else class="w-full flex flex-col items-center p-3">
    <p class="my-6 text-moon-20 text-beerus font-semibold font-averta">
      Select a block to edit
    </p>
    <SpiralArrow class="w-50% text-beerus" />
  </div>
</template>
