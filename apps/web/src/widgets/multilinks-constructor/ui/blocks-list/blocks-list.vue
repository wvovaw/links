<script setup lang="ts">
import type { BlockMeta, BlockName } from "@links/blocks";

import { blocksList } from "@links/blocks";
import { UIInput, UIMenu } from "@links/ui";
import { computed, ref } from "vue";
import { groupBy } from "~shared/lib/utils";


const emit = defineEmits<{ select: [name: BlockName] }>();

const { t, te } = useI18n();

const query = ref("");

function blockLabel(block: BlockMeta) {
  const key = `blocks.${block.name}.label`;
  return te(key) ? t(key) : block.label;
}

const filteredBlocks = computed(() => {
  const needle = query.value.trim().toLowerCase();
  if (!needle) return blocksList;
  return blocksList.filter((block) =>
    [blockLabel(block), block.name, block.description, ...block.keywords].some((field) =>
      field.toLowerCase().includes(needle),
    ),
  );
});

const groupedBlocks = computed(() => Object.entries(groupBy<BlockMeta>(["category"])([...filteredBlocks.value])));

function selectBlock(block: BlockMeta) {
  emit("select", block.name);
}
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <UIInput v-model="query" data-testid="blocks-search" full-width />
    <div
      v-for="[category, blocks] of groupedBlocks"
      :key="category"
      data-testid="blocks-group"
      class="flex flex-col gap-1"
    >
      <span class="px-2 text-trunks text-moon-12">{{ category }}</span>
      <UIMenu.Item v-for="block of blocks" :key="block.name" data-testid="blocks-list-item" @click="selectBlock(block)">
        <UIMenu.Icon :icon="block.icon" />
        <UIMenu.Title class="font-semibold">
          {{ blockLabel(block) }}
        </UIMenu.Title>
      </UIMenu.Item>
    </div>
  </div>
</template>
