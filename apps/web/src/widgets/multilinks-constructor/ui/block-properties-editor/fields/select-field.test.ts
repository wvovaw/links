import type { IBlockPropertySelect, IBlockPropertySelectMultiple } from "@links/blocks";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import SelectField from "./select-field.vue";

const single: IBlockPropertySelect = {
  id: 1,
  type: "select",
  label: "Layout",
  options: [
    { label: "List", value: "list" },
    { label: "Grid", value: "grid" },
  ],
  defaultValue: "list",
};

/** A multiple select as the contact form stores it: the list of the options that are ticked. */
const multiple: IBlockPropertySelectMultiple = {
  id: 2,
  type: "select",
  label: "Fields",
  isMultiple: true,
  options: [
    { label: "Name", value: "name" },
    { label: "Message", value: "message" },
  ],
  defaultValue: ["name", "message"],
};

describe("SelectField", () => {
  /* A property the owner never touched stores no value, so the schema's default is what is shown. */
  it("ticks the schema's default options for a multiple select that was never set", () => {
    const wrapper = mount(SelectField, { props: { field: multiple, id: "field-1" } });

    expect(wrapper.findAll('[role="checkbox"]').map((box) => box.attributes("aria-checked"))).toEqual(["true", "true"]);
  });

  it("adds and removes one value at a time", async () => {
    const wrapper = mount(SelectField, { props: { field: multiple, id: "field-1", modelValue: ["name"] } });
    const [, message] = wrapper.findAll('[role="checkbox"]');

    await message!.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([["name", "message"]]);

    /* The unchecked half of the pair: removing a value the field already held. */
    await wrapper.findAll('[role="checkbox"]')[0]!.trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([["message"]]);
  });

  /* A single select keeps the value it had: the checklist is only for a property declared multiple. */
  it("draws a single select as a picker, not as a checklist", () => {
    const wrapper = mount(SelectField, { props: { field: single, id: "field-0", modelValue: "grid" } });

    expect(wrapper.find('[role="checkbox"]').exists()).toBe(false);
    expect(wrapper.find('[role="combobox"]').exists()).toBe(true);
  });
});
