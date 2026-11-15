import type { IBlock } from "@links/blocks";

import { createBlock } from "@links/blocks";
import { describe, expect, it } from "vitest";

import { isBlockVisible, visibleBlocks } from "./visibility";

/** The clock is always an argument: nothing here reads the wall clock. */
const now = new Date("2026-12-01T12:00:00.000Z");

describe("isBlockVisible", () => {
  it("keeps a block without visibility visible", () => {
    expect(isBlockVisible(undefined, now)).toBe(true);
    expect(isBlockVisible({}, now)).toBe(true);
  });

  it("honours hidden", () => {
    expect(isBlockVisible({ hidden: true }, now)).toBe(false);
  });

  it("treats from as inclusive and to as exclusive", () => {
    expect(isBlockVisible({ from: "2026-12-01T12:00:00.000Z" }, now)).toBe(true);
    expect(isBlockVisible({ from: "2026-12-01T12:00:01.000Z" }, now)).toBe(false);
    expect(isBlockVisible({ to: "2026-12-01T12:00:00.000Z" }, now)).toBe(false);
    expect(isBlockVisible({ to: "2026-12-01T12:00:01.000Z" }, now)).toBe(true);
  });

  it("ignores an unparsable bound", () => {
    expect(isBlockVisible({ from: "yesterday", to: "tomorrow" }, now)).toBe(true);
  });

  /* A reversed pair would otherwise satisfy `at >= to` at every instant and hide the block forever. */
  it("treats an inverted range as no limit", () => {
    expect(isBlockVisible({ from: "2026-12-02T00:00:00.000Z", to: "2026-12-01T00:00:00.000Z" }, now)).toBe(true);
  });

  it("keeps hidden in charge of an inverted range", () => {
    expect(
      isBlockVisible({ hidden: true, from: "2026-12-02T00:00:00.000Z", to: "2026-12-01T00:00:00.000Z" }, now),
    ).toBe(false);
  });
});

function paragraphOf(id: string, visibility?: IBlock["visibility"]): IBlock {
  const block = createBlock("Paragraph", id);
  block.visibility = visibility;
  return block;
}

describe("visibleBlocks", () => {
  it("drops the blocks its schedule hides", () => {
    const blocks = [
      paragraphOf("shown"),
      paragraphOf("hidden", { hidden: true }),
      paragraphOf("ended", { to: "2026-12-01T11:59:59.000Z" }),
    ];

    expect(visibleBlocks(blocks, now).map((block) => block.id)).toEqual(["shown"]);
  });

  /* The boundary the payload and the markup must agree on: a `to` equal to `now` is already gone. */
  it("drops a block whose to equals the clock it is filtered with", () => {
    expect(visibleBlocks([paragraphOf("boundary", { to: now.toISOString() })], now)).toEqual([]);
  });
});
