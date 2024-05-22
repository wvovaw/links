import { defineStore } from "pinia";
import { ref } from "vue";
import type { BlockName, IBlock } from "~shared/core";
import { createBlock } from "~shared/core";
import { randomString } from "~shared/lib/utils";
import { useLinksStore } from "~entities/links";
import { LinksApi } from "~shared/api/appwrite";

const defaultPageTitle = "New multilinks page";
const defaultBlocksState: IBlock[] = [];
const defaultBackground = "background-image: linear-gradient(to top, #13b7c6, #00a1da, #0085e4, #635cd2, #a3009c);";

const generateBlockId = () => randomString(8);
function computeHash(obj: any) {
  return JSON.stringify(obj);
}

/**
 * Make sure _page.blocks array is not changed during page manipulations.
 * To empty the blocks array use _page.value.blocks.length = 0 :nd so on.
 */

export const useConstructorStore = defineStore("multilinks-constructor", () => {
  /* State */
  const linkId = ref<string | null>(null);
  const title = ref(defaultPageTitle); const blocks = ref<IBlock[]>(defaultBlocksState);
  const background = ref<string>(defaultBackground);
  const seo = ref<Record<string, any>>({});
  const selectedBlockId = ref<string | null>(null);
  const savedDataHash = ref<string | null>(null);

  const {
    undo: blocksUndo,
    redo: blocksRedo,
    clear: clearBlocksHistory,
    canRedo: blocksCanRedo,
    canUndo: blocksCanUndo,
    history: blocksHistory,
  } = useDebouncedRefHistory(blocks, { deep: true, dump: JSON.stringify, parse: JSON.parse, debounce: 350 });

  /* Getters */
  const canRedo = computed(() => blocksCanRedo.value);
  const canUndo = computed(() => blocksCanUndo.value);

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
        background: background.value,
      });
      savedDataHash.value = computeStoreHash();
    }
  }
  function undo() {
    blocksUndo();
  }
  function redo() {
    blocksRedo();
  }
  function clearHistory() {
    clearBlocksHistory();
  }
  function computeStoreHash() {
    return computeHash({
      blocks: toRaw(blocks.value),
      title: toRaw(title.value),
      seo: toRaw(seo.value),
    });
  }
  function hasUnsavedChanges() {
    return savedDataHash.value !== computeStoreHash();
  }

  /* Setup */
  function $reset() {
    linkId.value = null;
    title.value = defaultPageTitle;
    blocks.value = defaultBlocksState;
    background.value = defaultBackground;
    seo.value = {};
    selectedBlockId.value = null;
    savedDataHash.value = null;
    clearHistory();
  }

  async function setupStore(linkId: string) {
    try {
      const data = await LinksApi.getLink(linkId);
      if (data) {
        setId(data.$id);
        setBlocks(JSON.parse(data.blocks));
        setTitle(data.title);
        background.value = data.background;
        savedDataHash.value = computeStoreHash();
      }
    }
    catch (e: unknown) {
      if (e instanceof Error) {
        throw createError({
          statusCode: 404,
          statusMessage: e.message,
        });
      }
    }
  }
  onUnmounted(() => {
    $reset();
  });

  return {
    selectedBlockId,
    title,
    blocks,
    background,
    canUndo,
    canRedo,
    blocksHistory,
    undo,
    redo,
    clearHistory,
    setId,
    setBlocks,
    setTitle,
    getBlock,
    selectBlock,
    addBlock,
    removeBlock,
    duplicateBlock,
    saveCurrentState,
    hasUnsavedChanges,
    setupStore,
    $reset,
  };
});
