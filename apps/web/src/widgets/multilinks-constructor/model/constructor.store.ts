import type { BlockName, IBlock, IBlockPropertyImage, PageTheme } from "@links/blocks";

import {
  checkBlockUpToDate,
  createBlock,
  DEFAULT_PAGE_THEME,
  itemFieldsOf,
  listRows,
  migrateBlock,
} from "@links/blocks";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useLinksStore } from "~entities/links";
import { LinkStatus, LinksApi } from "~shared/api/backend";
import { isAbsoluteImageUrl, storesAsset } from "~shared/blocks";
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
  /* `null` means the page has no stored theme yet: it keeps rendering its raw legacy `background`. */
  const theme = ref<PageTheme | null>(null);
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
  /** A first edit turns a themeless (legacy) page into a themed one, starting from the defaults. */
  function setTheme(patch: Partial<PageTheme>) {
    theme.value = { ...(theme.value ?? DEFAULT_PAGE_THEME), ...patch };
  }
  function selectBlock(id: string) {
    selectedBlockId.value = id;
  }
  function getBlock(id: string): IBlock | undefined {
    return blocks.value.find((b) => b.id === id);
  }
  function addBlock(name: BlockName, index: number = blocks.value.length) {
    const id = generateBlockId();
    blocks.value.splice(index, 0, createBlock(name, id));
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

  /**
   * A stored file id, or `null` for a value that names no stored file. A migrated Avatar may still hold
   * a pasted url: it must never be sent as a file, or the backend would try to keep `https://…` as an
   * existing image.
   */
  function storedFileId(value: unknown): string | null {
    if (typeof value !== "string" || !value) return null;

    return isAbsoluteImageUrl(value) ? null : value;
  }

  /**
   * The stored file ids a page holds, split by the endpoint that stores them. A file of an `image`
   * property goes to the list that endpoint keeps; an `accept` that names anything but an image means
   * the field uploaded an asset instead.
   */
  function collectAttachmentFileIds(blocksList: IBlock[]): { imageFileIds: string[]; assetFileIds: string[] } {
    const imageFileIds: string[] = [];
    const assetFileIds: string[] = [];
    const listFor = (accept?: string) => (storesAsset(accept) ? assetFileIds : imageFileIds);
    const collect = (value: unknown, ids: string[]) => {
      const fileId = storedFileId(value);
      if (fileId) ids.push(fileId);
    };

    for (const block of blocksList) {
      for (const prop of Object.values(block.properties)) {
        if (prop.type === "image") collect(prop.value, listFor(prop.accept));

        /*
          A block that repeats images draws them from rows, not from an `image` property, and the API
          deletes every stored file it is not told about. Every stored row counts, complete or not: a
          half-filled row still holds the file its owner uploaded.
        */
        if (prop.type === "list") {
          const fileFields = itemFieldsOf(prop)
            .filter((field): field is IBlockPropertyImage & { key: string } => field.type === "image")
            .map((field) => ({ key: field.key, ids: listFor(field.accept) }));
          for (const row of listRows(prop)) {
            for (const field of fileFields) collect(row[field.key], field.ids);
          }
        }
      }
    }
    return { imageFileIds, assetFileIds };
  }

  async function saveCurrentState() {
    const { updateLink } = useLinksStore();
    const id = linkId.value;
    if (!id) return;

    const { imageFileIds, assetFileIds } = collectAttachmentFileIds(blocks.value);
    const contentSaved = await updateLink({
      id,
      title: title.value,
      blocks: blocks.value,
      seo: seo.value,
      status: publishStatus.value,
      imageFileIds,
      assetFileIds,
    });
    /* Cancelled or failed content update: nothing else is persisted and the page stays unsaved. */
    if (!contentSaved) return;

    /* A page that was never re-themed keeps its raw CSS, so it has no theme to store. */
    if (theme.value) await LinksApi.updateTheme({ id, theme: toRaw(theme.value) });
    savedDataHash.value = computeStoreHash();
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
      theme: toRaw(theme.value),
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
    theme.value = null;
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
        theme.value = data.theme;
        background.value = data.background;

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
    theme,
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
    setTheme,
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
