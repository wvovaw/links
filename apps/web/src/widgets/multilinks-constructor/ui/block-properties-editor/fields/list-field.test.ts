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
    { key: "title", id: 0, type: "text", label: "Title", required: true, defaultValue: "Untitled" },
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

  /*
    `setRowValue` is the only path that writes a value into a row, and the rows are keyed by index: a
    reused instance is exactly where a value lands in the wrong card.
  */
  it("writes a typed value into the row it was typed in, leaving the first row alone", async () => {
    const { wrapper, model } = mountField([one, two]);

    await wrapper.get("#field-0-row-1-title").setValue("Edited");

    expect(model.value[0]).toEqual({ title: "One", link: "https://a.example" });
    expect(model.value[1]).toEqual({ title: "Edited", link: "https://b.example" });
  });

  it("keeps that binding straight after a row is duplicated", async () => {
    const { wrapper, model } = mountField([one]);

    await wrapper.findAll("[data-testid='list-duplicate']")[0]!.trigger("click");
    await wrapper.get("#field-0-row-1-title").setValue("Edited");

    expect(model.value).toEqual([
      { title: "One", link: "https://a.example" },
      { title: "Edited", link: "https://a.example" },
    ]);
  });

  /* A row missing a required item field is never drawn, so the row editor has to say which they are. */
  it("marks the item fields the schema requires", () => {
    const { wrapper } = mountField([one]);

    expect(wrapper.get("label[for='field-0-row-0-title']").text()).toBe("Title (required)");
    expect(wrapper.get("label[for='field-0-row-0-link']").text()).toBe("Link");
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
