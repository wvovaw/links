<script setup lang="ts">
import type {
  BlockProperty,
  BlockPropertyType,
  IBlockPropertyBoolean,
  IBlockPropertyDate,
  IBlockVisibility,
} from "@links/blocks";

import { UIButton, UISeparator } from "@links/ui";
import { groupBy } from "~shared/lib/utils";
import { SpiralArrow } from "~shared/ui/doodles";

import { useConstructorStore } from "../../model";
import { OptionsSection } from "../options-section";
import BooleanField from "./fields/boolean-field.vue";
import ColorField from "./fields/color-field.vue";
import DateField from "./fields/date-field.vue";
import ImageField from "./fields/image-field.vue";
import NumberField from "./fields/number-field.vue";
import SelectField from "./fields/select-field.vue";
import TextField from "./fields/text-field.vue";
import UrlField from "./fields/url-field.vue";

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
  image: ImageField,
  date: DateField,
};
function resolveFieldsComponent(fieldType: BlockPropertyType) {
  return fieldsMap[fieldType];
}

const groupByGroupName = groupBy<BlockProperty>(["group"]);
const groupedProperties = computed(() => {
  const block = selectedBlockId.value ? getBlock(selectedBlockId.value) : null;
  const gp = groupByGroupName(Object.values(block?.properties ?? {}));
  return gp;
});

const selectedBlock = computed(() => (selectedBlockId.value ? getBlock(selectedBlockId.value) : undefined));

/**
 * The visibility controls reuse the property fields, so each needs a descriptor: only the label and
 * `withTime` are read. A schedule is not a property, which is why these are not part of the block.
 */
const hiddenField: IBlockPropertyBoolean = {
  id: 0,
  type: "boolean",
  label: "Hide this block",
  variant: "switch",
  defaultValue: false,
};
const fromField: IBlockPropertyDate = {
  id: 0,
  type: "date",
  label: "Show from",
  withTime: true,
  defaultValue: null,
};
const toField: IBlockPropertyDate = {
  id: 0,
  type: "date",
  label: "Show until",
  withTime: true,
  defaultValue: null,
};

/**
 * A schedule lives on the block, so it is written there rather than through a property. A cleared
 * bound is deleted instead of stored as an empty string, which `isBlockVisible` would ignore anyway.
 */
function setVisibilityBound(bound: "from" | "to", value: string | undefined) {
  const block = selectedBlock.value;
  if (!block) return;

  const visibility: IBlockVisibility = { ...block.visibility };
  if (value) visibility[bound] = value;
  else delete visibility[bound];
  block.visibility = visibility;
}

const hidden = computed({
  get: () => selectedBlock.value?.visibility?.hidden ?? false,
  set: (value: boolean) => {
    const block = selectedBlock.value;
    if (block) block.visibility = { ...block.visibility, hidden: value };
  },
});
const from = computed({
  get: () => selectedBlock.value?.visibility?.from,
  set: (value: string | undefined) => setVisibilityBound("from", value),
});
const to = computed({
  get: () => selectedBlock.value?.visibility?.to,
  set: (value: string | undefined) => setVisibilityBound("to", value),
});
</script>

<template>
  <template v-if="selectedBlockId">
    <OptionsSection title="Visibility">
      <BooleanField id="visibility-hidden" v-model="hidden" :field="hiddenField" />
      <DateField id="visibility-from" v-model="from" :field="fromField" />
      <DateField id="visibility-to" v-model="to" :field="toField" />
    </OptionsSection>
    <UISeparator />
    <template v-for="(group, name) of groupedProperties" :key="name">
      <OptionsSection :title="name ? name : 'Other'">
        <div v-for="field of group" :key="field.id">
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
    <p class="my-6 text-moon-20 text-beerus font-semibold font-averta">Select a block to edit</p>
    <SpiralArrow class="w-50% text-beerus" />
  </div>
</template>
