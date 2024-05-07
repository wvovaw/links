import { defineStore } from "pinia";
import { ref } from "vue";
import type { BlockName, IBlock } from "~shared/core";
import { createBlock } from "~shared/core";
import { randomString } from "~shared/lib/utils";
import { useLinksStore } from "~entities/links";

const defaultPageTitle = "New multilinks page";
const defaultBlocksState: IBlock[] = [];

const generateBlockId = () => randomString(8);

/**
 * Make sure _page.blocks array is not changed during page manipulations.
 * To empty the blocks array use _page.value.blocks.length = 0 :nd so on.
 */
// TODO: Implement Undo / Redo feature

export const useConstructorStore = defineStore("multilinks-constructor", () => {
  /* State */
  const selectedBlockId = ref<string | null>(null);
  const linkId = ref<string | null>(null);
  const title = ref(defaultPageTitle);
  const blocks = ref<IBlock[]>(defaultBlocksState);
  const seo = ref<Record<string, any>>({});

  /* Actions */
  function setId(id: string) {
    linkId.value = id;
  }
  function setTitle(newTitle: string) {
    title.value = newTitle;
  }
  function setBlocks(newBlocks: IBlock[]) {
    blocks.value.length = 0;
    blocks.value.push(...newBlocks);
  }
  function selectBlock(id: string) {
    selectedBlockId.value = id;
  }
  function getBlock(id: string): IBlock | undefined {
    return blocks.value.find(b => b.id === id);
  }
  function addBlock(name: BlockName) {
    const id = generateBlockId();
    blocks.value.push(createBlock(name, id));
    selectBlock(id);
  }
  function removeBlock(id: string) {
    if (selectedBlockId.value === id)
      selectedBlockId.value = null;
    const index = blocks.value.findIndex(b => b.id === id);
    blocks.value.splice(index, 1);
  }
  function duplicateBlock(id: string | null) {
    const block = id ? getBlock(id) : null;
    if (block) {
      const index = blocks.value.findIndex(b => b.id === id);
      const newBlockId = generateBlockId();
      blocks.value.splice(index, 0, { ...structuredClone(toRaw(block)), id: newBlockId });
    }
  }
  async function saveCurrentState() {
    const { updateLink } = useLinksStore();
    if (linkId.value) {
      await updateLink({
        id: linkId.value,
        title: title.value,
        blocks: blocks.value,
        seo: seo.value,
      });
    }
  }

  return {
    selectedBlockId,
    blocks,
    title,
    setId,
    setBlocks,
    setTitle,
    getBlock,
    selectBlock,
    addBlock,
    removeBlock,
    duplicateBlock,
    saveCurrentState,
  };
});
