import type { IBlockPropertyImage } from "@links/blocks";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import ImageField from "./image-field.vue";

const field: IBlockPropertyImage = {
  id: 0,
  type: "image",
  label: "Image",
  group: "Content",
  defaultValue: null,
};

function mountWithValue(value: string) {
  return mount(ImageField, { props: { field, id: "field-0", modelValue: value } });
}

describe("ImageField preview", () => {
  it("resolves a stored file id against the backend", () => {
    expect(mountWithValue("file-123").get("img").attributes("src")).toMatch(/\/storage\/images\/file-123$/);
  });

  it("shows a url pasted before the uploader as it is", () => {
    expect(mountWithValue("https://example.com/avatar.png").get("img").attributes("src")).toBe(
      "https://example.com/avatar.png",
    );
  });
});

/*
  A list row is keyed by its position, so duplicating or removing a row hands this field instance
  another row's value: the file name beside the preview has to come from the model, not from the
  instance's first render.
*/
describe("ImageField file name", () => {
  it("names the file the model holds", () => {
    expect(mountWithValue("file-123").text()).toContain("file-123");
  });

  it("follows the model to the file of the row it now edits", async () => {
    const wrapper = mountWithValue("file-123");
    await wrapper.setProps({ modelValue: "file-456" });

    expect(wrapper.text()).toContain("file-456");
    expect(wrapper.text()).not.toContain("file-123");
  });

  it("drops the file name when the model is cleared", async () => {
    const wrapper = mountWithValue("file-123");
    await wrapper.setProps({ modelValue: undefined });

    expect(wrapper.text()).not.toContain("file-123");
  });
});
