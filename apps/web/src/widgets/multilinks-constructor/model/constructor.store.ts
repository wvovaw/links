import { defineStore } from "pinia";
import { ref } from "vue";
import type { BlockName, IBlock, IPage } from "~shared/core";
import { createBlock } from "~shared/core";

export const useConstructorStore = defineStore("multilinks-constructor", () => {
  const blocksIds = ref(0);
  const selectedBlockId = ref<string | null>(null);
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
    if (selectedBlockId.value === id)
      selectedBlockId.value = null;
    const index = page.value.blocks.findIndex(b => b.id === id);
    page.value.blocks.splice(index, 1);
  }

  function duplicateBlock(id: string | null) {
    const block = id ? getBlock(id) : null;
    if (block) {
      const index = page.value.blocks.findIndex(b => b.id === id);
      const newBlockId = String(blocksIds.value++ + 1);
      page.value.blocks.splice(index, 0, { ...structuredClone(toRaw(block)), id: newBlockId });
    }
  }

  function selectBlock(id: string) {
    selectedBlockId.value = id;
  }

  function getBlock(id: string): IBlock | undefined {
    return page.value.blocks.find(b => b.id === id);
  }

  return {
    page,
    selectedBlockId,
    addBlock,
    removeBlock,
    duplicateBlock,
    selectBlock,
    getBlock,
  };
});
