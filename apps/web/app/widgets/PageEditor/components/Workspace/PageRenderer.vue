<script setup lang="ts">
import { animations } from "@formkit/drag-and-drop";
import { dragAndDrop, useDragAndDrop } from "@formkit/drag-and-drop/vue";
import "../../resources/theme.css";
import { usePageStore } from "../../stores/page.store";
import PageBlock from "./PageBlock.vue";

const pageStore = usePageStore();
const { page, selectedBlockId: selectedBlock } = storeToRefs(pageStore);
const { selectBlock } = pageStore;

const blocksMap = new Map();
function resolveBlockAsyncComponent(blockName: string) {
  if (blocksMap.has(blockName)) {
    return blocksMap.get(blockName);
  }
  else {
    const comp = defineAsyncComponent(() => import(`../../resources/blocks/${blockName}Block.vue`));
    blocksMap.set(blockName, comp);
    return comp;
  }
};
function isSelectedBlock(blockId: string) {
  const isit = selectedBlock.value === blockId;
  return isit;
};

const [draggableRoot, draggableBlocks] = useDragAndDrop(page.value.blocks, {
  draggable: el => !el.hasAttribute("data-dnd-no-drag"),
  plugins: [animations()],
});
watch(draggableBlocks, (newBlocks) => {
  pageStore.$patch((state) => {
    state.page.blocks = newBlocks;
  });
});
</script>

<template>
  <div class="min-w-full grow from-pink-300 via-purple-300 to-indigo-400 bg-gradient-to-t py-10">
    <div ref="draggableRoot" class="flex flex-col gap-4 p-2">
      <PageBlock
        v-for="block of draggableBlocks"
        :key="block.id"
        :is-selected="isSelectedBlock(block.id)"
        @select="selectBlock(block.id)"
      >
        <component
          :is="resolveBlockAsyncComponent(block.name)"
          :id="`block-${block.id}`"
          :properties="block.properties"
        />
      </PageBlock>
    </div>
  </div>
</template>
