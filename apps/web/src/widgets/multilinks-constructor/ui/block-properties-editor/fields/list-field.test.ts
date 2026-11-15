import type { IBlockPropertyList } from "@links/blocks";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h, ref } from "vue";

import ListField from "./list-field.vue";

const property: IBlockPropertyList = {
  id: 0,
  type: "list",
  label: "Rows",
  minItems: 1,
  maxItems: 3,
  defaultValue: [],
  itemFields: [
    { key: "title", id: 0, type: "text", label: "Title", defaultValue: "Untitled" },
    { key: "link", id: 1, type: "url", label: "Link", defaultValue: "" },
  ],
};

const one = { title: "One", link: "https://a.example" };
const two = { title: "Two", link: "https://b.example" };
const three = { title: "Three", link: "https://c.example" };

function mountField(value: Record<string, unknown>[]) {
  const model = ref(value);
  const Host = defineComponent({
    render: () =>
      h(ListField, {
        "field": property,
        "id": "field-0",
        "modelValue": model.value,
        "onUpdate:modelValue": (next: Record<string, unknown>[] | undefined) => {
          model.value = next ?? [];
        },
      }),
  });

  return { wrapper: mount(Host), model };
}

describe("ListField", () => {
  it("adds a row with every default value", async () => {
    const { wrapper, model } = mountField([one]);
    await wrapper.get("[data-testid='list-add']").trigger("click");

    expect(wrapper.findAll("[data-testid='list-row']")).toHaveLength(2);
    expect(model.value).toHaveLength(2);
    expect(model.value[1]).toEqual({ title: "Untitled", link: "" });
  });

  it("duplicates the values of the row it was clicked on", async () => {
    const { wrapper, model } = mountField([one]);
    await wrapper.findAll("[data-testid='list-duplicate']")[0]!.trigger("click");

    expect(model.value).toEqual([
      { title: "One", link: "https://a.example" },
      { title: "One", link: "https://a.example" },
    ]);
  });

  it("removes the row it was clicked on, not the last one", async () => {
    const { wrapper, model } = mountField([one, two]);
    await wrapper.findAll("[data-testid='list-remove']")[0]!.trigger("click");

    expect(model.value).toEqual([{ title: "Two", link: "https://b.example" }]);
  });

  it("blocks adding past maxItems and removing past minItems", async () => {
    const largest = mountField([one, two, three]);
    expect(largest.wrapper.get("[data-testid='list-add']").attributes("disabled")).toBeDefined();

    const smallest = mountField([one]);
    expect(smallest.wrapper.get("[data-testid='list-remove']").attributes("disabled")).toBeDefined();
  });
});
