import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useConstructorStore } from "../model";

describe("testing constructor store ordering", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("records one history entry per reorder and ignores a same-order update", async () => {
    const store = useConstructorStore();
    store.addBlock("Avatar");
    store.addBlock("Button");

    const originalOrder = store.blocks.map((block) => block.id);
    await vi.advanceTimersByTimeAsync(400);
    store.clearHistory();
    expect(store.canUndo).toBe(false);

    store.setBlocks([...store.blocks]);
    await vi.advanceTimersByTimeAsync(400);
    expect(store.canUndo).toBe(false);

    const [first, second] = store.blocks;
    store.setBlocks([second, first]);
    await vi.advanceTimersByTimeAsync(400);
    expect(store.blocksHistory).toHaveLength(2);
    expect(store.canUndo).toBe(true);
    expect(store.blocks.map((block) => block.id)).toEqual([originalOrder[1], originalOrder[0]]);

    store.undo();
    expect(store.blocks.map((block) => block.id)).toEqual(originalOrder);

    store.redo();
    expect(store.blocks.map((block) => block.id)).toEqual([originalOrder[1], originalOrder[0]]);
  });

  it("records a visibility toggle and keeps the block content through undo and redo", async () => {
    const store = useConstructorStore();
    store.addBlock("Paragraph");
    const id = store.blocks[0]?.id ?? "";
    /* History restores a parsed copy, so every read after undo or redo goes through the store again. */
    const visibility = () => store.getBlock(id)?.visibility;
    const text = () => store.getBlock(id)?.properties.text?.value;

    const created = store.getBlock(id);
    if (!created) throw new Error("the block was not added");
    created.properties.text!.value = "Kept text";
    await vi.advanceTimersByTimeAsync(400);
    store.clearHistory();

    created.visibility = { hidden: true };
    await vi.advanceTimersByTimeAsync(400);
    expect(store.canUndo).toBe(true);

    store.undo();
    expect(visibility()).toBeUndefined();
    expect(text()).toBe("Kept text");

    store.redo();
    expect(visibility()).toEqual({ hidden: true });
    expect(text()).toBe("Kept text");
  });
});

describe("testing constructor store insertion", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    /* The store's state array is module-level and mutated in place, so it carries blocks between tests. */
    useConstructorStore().blocks.length = 0;
  });

  it("inserts a block at the given index and selects it", () => {
    const store = useConstructorStore();
    store.addBlock("Avatar");
    store.addBlock("Button");
    const tailId = store.blocks[1]?.id;

    store.addBlock("Paragraph", 1);

    expect(store.blocks.map((block) => block.name)).toEqual(["Avatar", "Paragraph", "Button"]);
    expect(store.blocks[2]?.id).toBe(tailId);
    expect(store.selectedBlockId).toBe(store.blocks[1]?.id);
  });

  it("appends when no index is given", () => {
    const store = useConstructorStore();
    store.addBlock("Avatar");
    store.addBlock("Button", 1);

    expect(store.blocks.map((block) => block.name)).toEqual(["Avatar", "Button"]);
  });

  it("inserts into an empty page at index zero", () => {
    const store = useConstructorStore();
    store.addBlock("Paragraph", 0);

    expect(store.blocks).toHaveLength(1);
    expect(store.selectedBlockId).toBe(store.blocks[0]?.id);
  });
});
