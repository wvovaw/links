<script setup lang="ts">
import { UIInput, UIInputHint, UIInputLabel, UISwitch, UITextArea } from "@links/ui";
import { usePageStore } from "../../stores/page.store";
import { groupBy } from "~utils/object";
import type { IBlockProperty } from "~core/types";

const pageStore = usePageStore();
const { selectedBlock } = storeToRefs(pageStore);
const { getBlock } = pageStore;

const groupByGroupName = groupBy<IBlockProperty>(["group"]);
const groupedProperties = computed(() => {
  const block = selectedBlock.value ? getBlock(selectedBlock.value) : null;
  const gp = groupByGroupName(Object.values(block?.properties ?? {}));
  return gp;
});

const debounce = useDebounceFn((fn: () => void) => { fn(); }, 200);
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
        <h3 class="font-semibold">
          {{ name ? name : 'Other' }}
        </h3>
        <div
          class="w-full flex flex-col gap-2 border-(l-1 t-1 beerus) px-4 py-2"
        >
          <div
            v-for="(field, key) of group"
            :key="key"
          >
            <UIInputLabel :for="`${name}-field-${key}`">
              {{ field.label }}
            </UIInputLabel>
            <UIInput
              v-if="['number', 'string', 'url', 'color'].includes(field.type)"
              :id="`${name}-field-${key}`"
              :model-value="field.value"
              full-width
              :type="field.type"
              @update:model-value="(v) => debounce(() => field.value = v)"
            />
            <UITextArea
              v-else-if="field.type === 'text'"
              :id="`${name}-field-${key}`"
              resize="vertical"
              :rows="3"
              :model-value="field.value"
              @update:model-value="(v) => debounce(() => field.value = v)"
            />
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
