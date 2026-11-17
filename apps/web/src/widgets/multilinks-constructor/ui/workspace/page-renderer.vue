<script setup lang="ts">
import type { IBlock } from "@links/blocks";

import { animations, dragAndDrop, tearDown } from "@formkit/drag-and-drop";
// oxlint-disable-next-line import/no-unassigned-import
import "~shared/blocks/theme.css";
import { resolvePageStyle, useBlocksResolver, visibleBlocks } from "~shared/blocks";

import { useConstructorStore } from "../../model";
import PageBlock from "./page-block.vue";

const { resolve } = useBlocksResolver();

const constructorStore = useConstructorStore();
const { selectedBlockId, blocks, theme, background } = storeToRefs(constructorStore);
const { selectBlock, setBlocks, clearHistory, pauseHistory, resumeHistory } = constructorStore;

const emit = defineEmits<{ insert: [index: number] }>();

const pageStyle = computed(() => resolvePageStyle(theme.value, background.value));

function isSelectedBlock(blockId: string) {
  const isit = selectedBlockId.value === blockId;
  return isit;
}

/**
 * The constructor keeps every block in the flow: one its schedule hides is dimmed, not removed. One
 * clock decides the whole list, so reading it per block cannot dim two neighbours against two instants.
 */
const visibleIds = computed(() => new Set(visibleBlocks(blocks.value, new Date()).map((block) => block.id)));

function isHiddenBlock(block: IBlock) {
  return !visibleIds.value.has(block.id);
}

const draggableRoot = ref<HTMLElement>();
let reordered = false;

function hasSameBlockOrder(nextBlocks: IBlock[]) {
  return (
    nextBlocks.length === blocks.value.length &&
    nextBlocks.every((block, index) => block.id === blocks.value[index]?.id)
  );
}

onMounted(() => {
  // TODO: Make this work on mobile on long hold
  dragAndDrop({
    parent: draggableRoot.value!,
    getValues: () => blocks.value,
    setValues: (values) => {
      if (hasSameBlockOrder(values)) return;
      reordered = true;
      setBlocks(values);
    },
    config: {
      plugins: [animations({ duration: 100 })],
      onDragstart: () => {
        reordered = false;
        pauseHistory();
      },
      onDragend: () => {
        resumeHistory(reordered);
        reordered = false;
      },
    },
  });
  clearHistory();
});

onBeforeUnmount(() => {
  if (draggableRoot.value) tearDown(draggableRoot.value);
});
</script>

<template>
  <div class="link" :style="pageStyle">
    <div class="link__container">
      <button
        v-if="!blocks.length"
        class="w-full border-(2 dashed) border-beerus rounded-moon-i-sm p-6 text-trunks transition-colors hover:(border-piccolo text-bulma)"
        data-testid="empty-page-add-block"
        @click="emit('insert', 0)"
      >
        Add your first block
      </button>
      <div ref="draggableRoot" class="link__blocks-root">
        <PageBlock
          v-for="(block, index) of blocks"
          :key="block.id"
          :is-selected="isSelectedBlock(block.id)"
          :is-hidden="isHiddenBlock(block)"
          :index="index"
          :is-last="index === blocks.length - 1"
          @select="selectBlock(block.id)"
          @insert="(at) => emit('insert', at)"
        >
          <component :is="resolve(block.name)" :id="`block-${block.id}`" :properties="block.properties" />
        </PageBlock>
      </div>
    </div>
  </div>
</template>
