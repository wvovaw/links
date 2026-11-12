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
});
