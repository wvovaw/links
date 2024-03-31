<script setup lang="ts">
import "../theme.css";
import { Primitive } from "radix-vue";
import { usePageStore } from "../stores/page.store";

const pageStore = usePageStore();
const { page, selectedBlock } = storeToRefs(pageStore);
const { selectBlock } = pageStore;

const blocksMap = new Map();
function resolveBlockAsyncComponent(blockName: string) {
  if (blocksMap.has(blockName)) {
    return blocksMap.get(blockName);
  }
  else {
    const comp = defineAsyncComponent(() => import(`./blocks/${blockName}Block.vue`));
    blocksMap.set(blockName, comp);
    return comp;
  }
};
function isSelectedBlock(blockId: string) {
  const isit = selectedBlock.value === blockId;
  return isit;
};
</script>

<template>
  <div class="min-w-full grow from-pink-300 via-purple-300 to-indigo-400 bg-gradient-to-t py-10">
    <div class="w-full flex flex-col items-center gap-4 p-2">
      <Primitive
        v-for="block of page.blocks"
        :key="block.id"
        v-memo="[block, isSelectedBlock(block.id)]"
        :class="{
          'box-border outline-(2 dashed popo)': isSelectedBlock(block.id),
        }"
        :data-selected-block="isSelectedBlock(block.id)"
        as-child
        @click="selectBlock(block.id)"
      >
        <component
          :is="resolveBlockAsyncComponent(block.name)"
          :id="`block-${block.id}`"
          :properties="block.properties"
        />
      </Primitive>
    </div>
  </div>
</template>
