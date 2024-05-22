<script setup lang="ts">
import { animations, dragAndDrop } from "@formkit/drag-and-drop";
import "~shared/core/resources/theme.css";
import { useConstructorStore } from "../../model";
import PageBlock from "./PageBlock.vue";
import { useBlocksResolver } from "~shared/core";

const { resolve } = useBlocksResolver();

const constructorStore = useConstructorStore();
const { selectedBlockId: selectedBlock, blocks, background } = storeToRefs(constructorStore);
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
  <div class="link rounded-40px" :style="background">
    <div class="link__container">
      <div ref="draggableRoot" class="link__blocks-root">
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
    </div>
  </div>
</template>
