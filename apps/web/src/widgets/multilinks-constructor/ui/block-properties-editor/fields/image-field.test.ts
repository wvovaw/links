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
