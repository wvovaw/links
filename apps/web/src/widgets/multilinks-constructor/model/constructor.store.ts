import type { BlockName, IBlock } from "@links/blocks";

import { checkBlockUpToDate, createBlock, migrateBlock } from "@links/blocks";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useLinksStore } from "~entities/links";
import { LinkStatus, LinksApi } from "~shared/api/backend";
import { randomString } from "~shared/lib/utils";

const defaultPageTitle = "New multilinks page";
const defaultBlocksState: IBlock[] = [];
const defaultBackground = "background-image: linear-gradient(to top, #13b7c6, #00a1da, #0085e4, #635cd2, #a3009c);";

const generateBlockId = () => randomString(8);
function computeHash(obj: unknown) {
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
  const publishStatus = ref<LinkStatus>(LinkStatus.DRAFT);
  const blocks = ref<IBlock[]>(defaultBlocksState);
  const background = ref<string>(defaultBackground);
  const seo = ref<Record<string, unknown>>({});
  const selectedBlockId = ref<string | null>(null);
  const savedDataHash = ref<string | null>(null);

  const {
    undo: blocksUndo,
    redo: blocksRedo,
    clear: clearBlocksHistory,
    canRedo: blocksCanRedo,
    canUndo: blocksCanUndo,
    history: blocksHistory,
    pause: pauseBlocksHistory,
    resume: resumeBlocksHistory,
  } = useDebouncedRefHistory(blocks, { deep: true, dump: JSON.stringify, parse: JSON.parse, debounce: 350 });

  /* Getters */
  const canRedo = computed(() => blocksCanRedo.value);
  const canUndo = computed(() => blocksCanUndo.value);

  /* Actions */
  function setTitle(newTitle: string) {
    title.value = newTitle;
  }
  function setPublishStatus(status: LinkStatus) {
    publishStatus.value = status;
  }
  function setBlocks(newBlocks: IBlock[]) {
    if (
      blocks.value.length === newBlocks.length &&
      blocks.value.every((block, index) => block.id === newBlocks[index]?.id)
    )
      return;
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
    return blocks.value.find((b) => b.id === id);
  }
  function addBlock(name: BlockName) {
    const id = generateBlockId();
    blocks.value.push(createBlock(name, id));
    selectBlock(id);
  }
  function removeBlock(id: string | null) {
    if (selectedBlockId.value === id) selectedBlockId.value = null;
    const index = blocks.value.findIndex((b) => b.id === id);
    blocks.value.splice(index, 1);
  }
  function duplicateBlock(id: string | null) {
    const block = id ? getBlock(id) : null;
    if (block) {
      const index = blocks.value.findIndex((b) => b.id === id);
      const newBlockId = generateBlockId();
      blocks.value.splice(index, 0, { ...structuredClone(toRaw(block)), id: newBlockId });
    }
  }
  function collectImageFileIds(blocksList: IBlock[]): string[] {
    const ids: string[] = [];
    for (const block of blocksList) {
      for (const prop of Object.values(block.properties)) {
        if (prop.type === "image" && prop.value) {
          ids.push(prop.value);
        }
      }
    }
    return ids;
  }

  async function saveCurrentState() {
    const { updateLink } = useLinksStore();
    if (linkId.value) {
      const imageFileIds = collectImageFileIds(blocks.value);
      await updateLink({
        id: linkId.value,
        title: title.value,
        blocks: blocks.value,
        seo: seo.value,
        background: background.value,
        status: publishStatus.value,
        imageFileIds,
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
  function pauseHistory() {
    pauseBlocksHistory();
  }
  function resumeHistory(commit = false) {
    resumeBlocksHistory(commit);
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
    publishStatus.value = LinkStatus.DRAFT;
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
        linkId.value = data.id;
        linkName.value = data.slug;
        setTitle(data.title);
        setPublishStatus(data.status);
        setBackground(data.background);

        // Blocks are already parsed from the backend
        const blocksList: IBlock[] = data.blocks as IBlock[];
        blocksList.forEach((block) => {
          const info = checkBlockUpToDate(block);
          if (!info.upToDate) block = migrateBlock(block);
        });
        setBlocks(blocksList);

        savedDataHash.value = computeStoreHash();
      }
    } catch (e: unknown) {
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
    pauseHistory,
    resumeHistory,
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
