<script setup lang="ts">
import { animations } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import "~shared/core/resources/theme.css";
import { useConstructorStore } from "../../model";
import PageBlock from "./PageBlock.vue";
import PageBackground from "./PageBackground.vue";

const constructorStore = useConstructorStore();
const { selectedBlockId: selectedBlock, blocks } = storeToRefs(constructorStore);
const { selectBlock } = constructorStore;

const blocksMap = new Map();
function resolveBlockAsyncComponent(blockName: string) {
  if (blocksMap.has(blockName)) {
    return blocksMap.get(blockName);
  }
  else {
    const comp = defineAsyncComponent(() => import(`../../../../shared/core/resources/blocks/${blockName}Block.vue`));
    blocksMap.set(blockName, comp);
    return comp;
  }
};
function isSelectedBlock(blockId: string) {
  const isit = selectedBlock.value === blockId;
  return isit;
};

const [draggableRoot, draggableBlocks] = useDragAndDrop(blocks.value, {
  draggable: el => !el.hasAttribute("data-dnd-no-drag"),
  plugins: [animations({ duration: 100 })],
});
watch(draggableBlocks, (newBlocks) => {
  constructorStore.$patch((state) => {
    state.blocks = newBlocks;
  });
});
</script>

<template>
  <PageBackground>
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
  </PageBackground>
</template>
