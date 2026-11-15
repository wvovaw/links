import type { IBlockPropertyImage } from "@links/blocks";

import { UIFileUpload } from "@links/ui";
import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ImageField from "./image-field.vue";

const storage = vi.hoisted(() => ({
  uploadImage: vi.fn(async () => "uploaded-image"),
  uploadAsset: vi.fn(async () => "uploaded-asset"),
}));

vi.mock("~shared/api/backend", () => ({
  StorageApi: {
    ...storage,
    resolveImageUrl: (fileId: string, { origin }: { origin: string }) => `${origin}/storage/images/${fileId}`,
    resolveAssetUrl: (fileId: string, { origin }: { origin: string }) => `${origin}/storage/assets/${fileId}`,
  },
}));

const field: IBlockPropertyImage = {
  id: 0,
  type: "image",
  label: "Image",
  group: "Content",
  defaultValue: null,
};

/** A property that offers a video: the same field, storing a file the asset endpoint owns. */
const videoField: IBlockPropertyImage = { ...field, label: "Video", accept: "video/mp4" };

function mountWithValue(properties: IBlockPropertyImage, value?: string) {
  return mount(ImageField, { props: { field: properties, id: "field-0", modelValue: value } });
}

async function pick(wrapper: ReturnType<typeof mountWithValue>) {
  const file = new File(["x"], "clip.mp4", { type: "video/mp4" });
  await wrapper.findComponent(UIFileUpload.Root).vm.$emit("change", file);
  await flushPromises();
}

describe("ImageField preview", () => {
  it("resolves a stored file id against the backend", () => {
    expect(mountWithValue(field, "file-123").get("img").attributes("src")).toMatch(/\/storage\/images\/file-123$/);
  });

  it("shows a url pasted before the uploader as it is", () => {
    expect(mountWithValue(field, "https://example.com/avatar.png").get("img").attributes("src")).toBe(
      "https://example.com/avatar.png",
    );
  });

  /* An `<img>` cannot draw a video or a pdf, so a field that stores an asset shows its name alone. */
  it("draws no preview for a value that is not an image", () => {
    expect(mountWithValue(videoField, "asset-123").find("img").exists()).toBe(false);
  });
});

/*
  The picker must offer what the API stores and nothing else: `image/*` would offer an svg, an avif or
  a heic, which `local-storage.service.ts` refuses, and the picker would turn that into a bare 400.
*/
describe("ImageField accepted types", () => {
  it("offers exactly the image types the API stores", () => {
    expect(mountWithValue(field).get("input[type=file]").attributes("accept")).toBe(
      "image/png,image/jpeg,image/webp,image/gif",
    );
  });

  it("keeps a property's own accept", () => {
    expect(mountWithValue(videoField).get("input[type=file]").attributes("accept")).toBe("video/mp4");
  });
});

describe("ImageField uploads", () => {
  beforeEach(() => {
    storage.uploadImage.mockClear();
    storage.uploadAsset.mockClear();
  });

  /* Which endpoint stores the file follows the property's `accept`, the same rule the save reports by. */
  it("uploads a video through the asset endpoint", async () => {
    const wrapper = mountWithValue(videoField);

    await pick(wrapper);

    expect(storage.uploadAsset).toHaveBeenCalledTimes(1);
    expect(storage.uploadImage).not.toHaveBeenCalled();
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["uploaded-asset"]);
  });

  it("uploads an image through the image endpoint", async () => {
    const wrapper = mountWithValue(field);

    await pick(wrapper);

    expect(storage.uploadImage).toHaveBeenCalledTimes(1);
    expect(storage.uploadAsset).not.toHaveBeenCalled();
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["uploaded-image"]);
  });
});

/*
  A list row is keyed by its position, so duplicating or removing a row hands this field instance
  another row's value: the file name beside the preview has to come from the model, not from the
  instance's first render.
*/
describe("ImageField file name", () => {
  it("names the file the model holds", () => {
    expect(mountWithValue(field, "file-123").text()).toContain("file-123");
  });

  it("follows the model to the file of the row it now edits", async () => {
    const wrapper = mountWithValue(field, "file-123");
    await wrapper.setProps({ modelValue: "file-456" });

    expect(wrapper.text()).toContain("file-456");
    expect(wrapper.text()).not.toContain("file-123");
  });

  it("drops the file name when the model is cleared", async () => {
    const wrapper = mountWithValue(field, "file-123");
    await wrapper.setProps({ modelValue: undefined });

    expect(wrapper.text()).not.toContain("file-123");
  });
});
