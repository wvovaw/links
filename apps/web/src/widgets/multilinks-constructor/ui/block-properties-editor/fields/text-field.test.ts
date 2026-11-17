import type { IBlockPropertyText } from "@links/blocks";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import TextField from "./text-field.vue";

const multiline: IBlockPropertyText = {
  id: 0,
  type: "text",
  label: "Paragraph text",
  multiline: true,
  maxLength: 200,
  minLength: 2,
  defaultValue: null,
};

describe("TextField", () => {
  it("hands the stored limits to the textarea", () => {
    const wrapper = mount(TextField, { props: { field: multiline, id: "field-0", modelValue: "" } });

    expect(wrapper.get("textarea").attributes("maxlength")).toBe("200");
    expect(wrapper.get("textarea").attributes("minlength")).toBe("2");
  });

  it("hands the stored limits to the single-line input", () => {
    const field: IBlockPropertyText = { ...multiline, multiline: false };
    const wrapper = mount(TextField, { props: { field, id: "field-0", modelValue: "" } });

    expect(wrapper.get("input").attributes("maxlength")).toBe("200");
    expect(wrapper.get("input").attributes("minlength")).toBe("2");
  });
});
