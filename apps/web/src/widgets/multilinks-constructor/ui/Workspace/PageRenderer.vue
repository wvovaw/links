<script setup lang="ts">
import { animations, dragAndDrop } from "@formkit/drag-and-drop";
import "~shared/core/resources/theme.css";
import { useConstructorStore } from "../../model";
import PageBlock from "./PageBlock.vue";
import PageBackground from "./PageBackground.vue";
import { useBlocksResolver } from "~shared/core";

const { resolve } = useBlocksResolver();

const constructorStore = useConstructorStore();
const { selectedBlockId: selectedBlock, blocks } = storeToRefs(constructorStore);
const { selectBlock, setBlocks, clearHistory } = constructorStore;

function isSelectedBlock(blockId: string) {
  const isit = selectedBlock.value === blockId;
  return isit;
};

const draggableRoot = ref<HTMLElement>();
onMounted(() => {
  dragAndDrop({
    parent: draggableRoot.value!,
    getValues: () => blocks.value,
    setValues: (values) => { setBlocks(values); },
    config: {
      plugins: [animations({ duration: 100 })],
    },
  });
  clearHistory();
});
</script>

<template>
  <PageBackground>
    <div ref="draggableRoot" class="flex flex-col gap-4 p-2">
      <PageBlock
        v-for="block of blocks"
        :key="block.id"
        :is-selected="isSelectedBlock(block.id)"
        @select="selectBlock(block.id)"
      >
        <component
          :is="resolve(block.name)"
          :id="`block-${block.id}`"
          :properties="block.properties"
        />
      </PageBlock>
    </div>
  </PageBackground>
</template>
