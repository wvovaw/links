import { migrateBlock } from "@links/blocks";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useConstructorStore } from "../model";

const updateLink = vi.hoisted(() => vi.fn(async () => true));

vi.mock("~entities/links", () => ({ useLinksStore: () => ({ updateLink }) }));

/** The stored shape of an Avatar as written before the uploader, carrying a pasted image url. */
const legacyAvatar = {
  id: "avatar-legacy",
  version: 0,
  name: "Avatar",
  properties: {
    image: {
      id: 0,
      type: "url",
      label: "Image url",
      group: "Content",
      defaultValue: null,
      value: "https://example.com/me.png",
    },
    text: { id: 1, type: "text", label: "Heading", group: "Content", defaultValue: null },
  },
} as const;

describe("constructor store image file ids", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    updateLink.mockClear();
  });

  it("submits a stored file id and never a url pasted before the uploader", async () => {
    const store = useConstructorStore();
    store.linkId = "link-1";
    store.setBlocks([
      migrateBlock(structuredClone(legacyAvatar)),
      { ...migrateBlock(structuredClone(legacyAvatar)), id: "avatar-uploaded" },
    ]);
    store.blocks[1]!.properties.image!.value = "file-123";

    await store.saveCurrentState();

    expect(updateLink).toHaveBeenCalledWith(expect.objectContaining({ imageFileIds: ["file-123"] }));
  });
});
