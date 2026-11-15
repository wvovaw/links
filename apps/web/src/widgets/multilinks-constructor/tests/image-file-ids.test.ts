import { createBlock, migrateBlock } from "@links/blocks";
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

  /*
    Property definitions are stored JSON too, and the API takes `blocks` as unknown: a list saved
    without usable item fields must not throw inside the save and leave the owner unable to persist
    the page at all. The files the other properties name are still reported.
  */
  it.each([
    ["has no item fields", (items: Record<string, unknown>) => delete items.itemFields],
    ["has item fields that are not a list", (items: Record<string, unknown>) => (items.itemFields = "image")],
  ])("saves a page whose list property %s", async (_case, breakItemFields) => {
    const store = useConstructorStore();
    store.linkId = "link-1";
    /*
      The store starts from one module-level blocks array and `setBlocks` returns early when the ids
      match, so this test names its own blocks; the build also reuses one literal per factory call, so
      it breaks a copy.
    */
    const avatar = structuredClone(createBlock("Avatar", "avatar-no-fields"));
    const gallery = structuredClone(createBlock("Gallery", "gallery-no-fields"));
    store.setBlocks([avatar, gallery]);
    store.blocks[0]!.properties.image!.value = "file-top";
    store.blocks[1]!.properties.items!.value = [{ image: "file-a", alt: "A" }];
    breakItemFields(store.blocks[1]!.properties.items as unknown as Record<string, unknown>);

    await store.saveCurrentState();

    expect(updateLink).toHaveBeenCalledWith(expect.objectContaining({ imageFileIds: ["file-top"] }));
  });

  /*
    The API deletes every stored file it is not told about, so a block that keeps its images inside
    rows must report them or the owner's uploads disappear on the next save.
  */
  it("submits the file ids a list block keeps in its rows", async () => {
    const store = useConstructorStore();
    store.linkId = "link-1";
    const avatar = createBlock("Avatar", "avatar-1");
    const gallery = createBlock("Gallery", "gallery-1");
    store.setBlocks([avatar, gallery]);
    store.blocks[0]!.properties.image!.value = "file-top";
    store.blocks[1]!.properties.items!.value = [
      { image: "file-a", alt: "A" },
      { image: "https://cdn.example/b.png", alt: "B" },
      /* Half-filled: no alt text yet, but the uploaded file is still stored and still the owner's. */
      { image: "file-c", alt: "" },
      { image: null, alt: "Nothing uploaded yet" },
    ];

    await store.saveCurrentState();

    expect(updateLink).toHaveBeenCalledWith(
      expect.objectContaining({ imageFileIds: ["file-top", "file-a", "file-c"] }),
    );
  });

  /*
    Products needs a name and a checkout link in every row, so a row can hold an uploaded image and
    still be one a page never draws. The save names the file anyway: it is already on the server, and a
    row that is deleted while half-filled would otherwise have its file cleaned up behind the owner's
    back. This distinguishes "every stored row" from "every complete row", which a Gallery cannot —
    its single required key is the image itself.
  */
  it("submits the image of a products row that is not complete yet", async () => {
    const store = useConstructorStore();
    store.linkId = "link-1";
    store.setBlocks([createBlock("Products", "products-1")]);
    store.blocks[0]!.properties.items!.value = [
      { image: "file-kept", title: "", price: "900 ₽", url: "https://shop.example/mug" },
    ];

    await store.saveCurrentState();

    expect(updateLink).toHaveBeenCalledWith(expect.objectContaining({ imageFileIds: ["file-kept"] }));
  });
});
