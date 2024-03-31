import { defineStore } from "pinia";
import { ref } from "vue";
import type { BlockName, IBlock, IPage } from "~core/types";
import { createBlock } from "~core/blocks";

export const usePageStore = defineStore("page-store", () => {
  const blocksIds = ref(0);
  const selectedBlock = ref<string | null>(null);
  const page = ref<IPage>(
    {
      id: "testpage",
      title: "New multilinks page",
      blocks: [],
    },
  );

  function addBlock(name: BlockName) {
    const id = String(blocksIds.value++ + 1);
    page.value.blocks.push(createBlock(name, id));
    selectBlock(id);
  }
  function removeBlock(id: string) {
    page.value.blocks = page.value.blocks.filter(b => b.id !== id);
  }
  function selectBlock(id: string) {
    selectedBlock.value = id;
  }
  function getBlock(id: string): IBlock | undefined {
    return page.value.blocks.find(b => b.id === id);
  }

  return {
    page,
    selectedBlock,
    addBlock,
    removeBlock,
    selectBlock,
    getBlock
  };
});
