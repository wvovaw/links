import { defineStore } from "pinia";
import { ref } from "vue";
import type { BlockName, IBlock } from "@links/blocks";
import { checkBlockUpToDate, createBlock, migrateBlock } from "@links/blocks";
import { randomString } from "~shared/lib/utils";
import { useLinksStore } from "~entities/links";
import { LinkPublishStatus, LinksApi } from "~shared/api/appwrite";

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
  const title = ref(defaultPageTitle);
  const linkName = ref<string | null>(null);
  const publishStatus = ref<LinkPublishStatus>(LinkPublishStatus.DRAFT);
  const blocks = ref<IBlock[]>(defaultBlocksState);
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
  function setTitle(newTitle: string) {
    title.value = newTitle;
  }
  function setPublishStatus(status: LinkPublishStatus) {
    publishStatus.value = status;
  }
  function setBlocks(newBlocks: IBlock[]) {
    blocks.value.length = 0;
    blocks.value.push(...newBlocks);
  }
  function setBackground(newBackground: string) {
    background.value = newBackground;
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
  function removeBlock(id: string | null) {
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
        status: publishStatus.value,
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
    linkName.value = null;
    publishStatus.value = LinkPublishStatus.DRAFT;
    blocks.value = defaultBlocksState;
    background.value = defaultBackground;
    seo.value = {};
    selectedBlockId.value = null;
    savedDataHash.value = null;
    clearHistory();
  }

  async function setupStore(id: string) {
    try {
      const data = await LinksApi.getLink(id);
      if (data) {
        publishStatus.value = data.status;
        linkId.value = data.$id;
        linkName.value = data.name.$id;
        setTitle(data.title);
        setPublishStatus(data.status);
        setBackground(data.background);

        // Parse blocks and upgrade outdated ones
        const blocks: IBlock[] = JSON.parse(data.blocks);
        blocks.forEach((block) => {
          const info = checkBlockUpToDate(block);
          if (!info.upToDate)
            block = migrateBlock(block);
        });
        console.log(blocks);
        setBlocks(blocks);

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
    linkId,
    linkName,
    selectedBlockId,
    publishStatus,
    title,
    blocks,
    background,
    canUndo,
    canRedo,
    blocksHistory,
    undo,
    redo,
    clearHistory,
    setBlocks,
    setTitle,
    setBackground,
    setPublishStatus,
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
