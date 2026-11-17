import type { IBlockPropertyList } from "@links/blocks";

import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
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

/** `itemFields` may be absent in a property another version stored, so it is the caller's to set. */
function mountField(value: Record<string, unknown>[], field: IBlockPropertyList = property) {
  const model = ref(value);
  const Host = defineComponent({
    render: () =>
      h(ListField, {
        "field": field,
        "id": "field-0",
        "modelValue": model.value,
        "onUpdate:modelValue": (next: Record<string, unknown>[] | undefined) => {
          model.value = next ?? [];
        },
      }),
  });

  return { wrapper: mount(Host), model };
}

/** Rows mount collapsed, and the fields of a row appear a tick after its header is clicked. */
async function openRows(wrapper: VueWrapper, ...indices: number[]) {
  for (const index of indices) {
    await wrapper.findAll("[data-testid='list-row-toggle']")[index]!.trigger("click");
    await flushPromises();
  }
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
    await openRows(wrapper, 1);

    await wrapper.get("#field-0-row-1-title").setValue("Edited");

    expect(model.value[0]).toEqual({ title: "One", link: "https://a.example" });
    expect(model.value[1]).toEqual({ title: "Edited", link: "https://b.example" });
  });

  it("keeps that binding straight after a row is duplicated", async () => {
    const { wrapper, model } = mountField([one]);

    await wrapper.findAll("[data-testid='list-duplicate']")[0]!.trigger("click");
    await flushPromises();

    // The copy is the row that arrived open, so it is the one to type into.
    await wrapper.get("#field-0-row-1-title").setValue("Edited");

    expect(model.value).toEqual([
      { title: "One", link: "https://a.example" },
      { title: "Edited", link: "https://a.example" },
    ]);
  });

  /* A row missing a required item field is never drawn, so the row editor has to say which they are. */
  it("marks the item fields the schema requires", async () => {
    const { wrapper } = mountField([one]);
    await openRows(wrapper, 0);

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

describe("ListField rows", () => {
  it("keeps a row's item fields out of the document until the row is opened", async () => {
    const { wrapper } = mountField([one, two]);

    expect(wrapper.find("#field-0-row-0-title").exists()).toBe(false);

    await openRows(wrapper, 0);

    expect(wrapper.find("#field-0-row-0-title").exists()).toBe(true);
    expect(wrapper.find("#field-0-row-1-title").exists()).toBe(false);
  });

  it("summarises a row with its first filled item field", () => {
    const { wrapper } = mountField([{ title: "", link: "https://a.example" }, one]);

    const summaries = wrapper.findAll("[data-testid='list-row-summary']");
    expect(summaries[0]!.text()).toBe("https://a.example");
    expect(summaries[1]!.text()).toBe("One");
  });

  it("shows an image row by the name of the file it stored", () => {
    const imageField: IBlockPropertyList = {
      ...property,
      itemFields: [{ key: "image", id: 0, type: "image", label: "Image", defaultValue: null }],
    };
    const { wrapper } = mountField([{ image: "images/2026/a1b2.png" }], imageField);

    expect(wrapper.get("[data-testid='list-row-summary']").text()).toBe("a1b2.png");
  });

  /* A value that is not a string is content — nothing is missing — but it is not a caption either. */
  it("shows no summary for a value that is not a string, and marks only the empty field", () => {
    const { wrapper } = mountField([{ title: { nested: true } }, { title: null }]);

    expect(wrapper.find("[data-testid='list-row-summary']").exists()).toBe(false);

    const markers = wrapper.findAll("[data-testid='list-row-required']");
    expect(markers).toHaveLength(1);
    expect(markers[0]!.text()).toContain("Title");
  });

  it("names the required item fields a row has left blank, and drops the marker once they are filled", async () => {
    const { wrapper } = mountField([{ title: "", link: "" }]);

    expect(wrapper.get("[data-testid='list-row-required']").text()).toContain("Title");

    await openRows(wrapper, 0);
    await wrapper.get("#field-0-row-0-title").setValue("Filled");

    expect(wrapper.find("[data-testid='list-row-required']").exists()).toBe(false);
    expect(wrapper.get("[data-testid='list-row-summary']").text()).toBe("Filled");
  });

  it("draws no row chrome for an empty list", () => {
    const { wrapper } = mountField([]);

    expect(wrapper.find("[data-testid='list-row']").exists()).toBe(false);
    expect(wrapper.text()).toContain("No rows yet");
    expect(wrapper.get("[data-testid='list-add']").attributes("disabled")).toBeUndefined();
  });

  it("keeps drawing rows whose property declares no item fields", () => {
    const withoutFields = { ...property, itemFields: undefined } as unknown as IBlockPropertyList;
    const { wrapper } = mountField([one], withoutFields);

    expect(wrapper.findAll("[data-testid='list-row']")).toHaveLength(1);
    expect(wrapper.find("[data-testid='list-row-summary']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='list-row-required']").exists()).toBe(false);
  });

  it("adds a row open and leaves the others as they were", async () => {
    const { wrapper } = mountField([one]);

    await wrapper.get("[data-testid='list-add']").trigger("click");
    await flushPromises();

    expect(wrapper.find("#field-0-row-1-title").exists()).toBe(true);
    expect(wrapper.find("#field-0-row-0-title").exists()).toBe(false);
  });

  it("duplicates a row open, keeping the open row it pushed down open", async () => {
    const { wrapper } = mountField([one, two]);
    await openRows(wrapper, 1);

    await wrapper.findAll("[data-testid='list-duplicate']")[0]!.trigger("click");
    await flushPromises();

    expect(wrapper.find("#field-0-row-1-title").exists()).toBe(true);
    expect(wrapper.find("#field-0-row-2-title").exists()).toBe(true);
    expect(wrapper.find("#field-0-row-0-title").exists()).toBe(false);
  });

  it("keeps an open row open when the row above it is removed", async () => {
    const { wrapper } = mountField([one, two]);
    await openRows(wrapper, 1);

    await wrapper.findAll("[data-testid='list-remove']")[0]!.trigger("click");
    await flushPromises();

    expect(wrapper.findAll("[data-testid='list-row']")).toHaveLength(1);
    expect(wrapper.find("#field-0-row-0-title").exists()).toBe(true);
  });
});

describe("ListField row order", () => {
  it("moves a row up past its neighbour", async () => {
    const { wrapper, model } = mountField([one, two]);

    await wrapper.findAll("[data-testid='list-move-up']")[1]!.trigger("click");

    expect(model.value).toEqual([two, one]);
  });

  it("moves a row down past its neighbour", async () => {
    const { wrapper, model } = mountField([one, two]);

    await wrapper.findAll("[data-testid='list-move-down']")[0]!.trigger("click");

    expect(model.value).toEqual([two, one]);
  });

  it("stops at the ends", () => {
    const { wrapper } = mountField([one, two]);

    expect(wrapper.findAll("[data-testid='list-move-up']")[0]!.attributes("disabled")).toBeDefined();
    expect(wrapper.findAll("[data-testid='list-move-down']")[1]!.attributes("disabled")).toBeDefined();
  });

  /* Moving is about position, not count, so the floor and the ceiling do not touch it. */
  it("moves rows at minItems and at maxItems alike", async () => {
    const smallest = mountField([one]);
    await smallest.wrapper.findAll("[data-testid='list-move-down']")[0]!.trigger("click");
    expect(smallest.model.value).toEqual([one]);

    const largest = mountField([one, two, three]);
    expect(largest.wrapper.get("[data-testid='list-add']").attributes("disabled")).toBeDefined();
    await largest.wrapper.findAll("[data-testid='list-move-up']")[2]!.trigger("click");
    expect(largest.model.value).toEqual([one, three, two]);
  });

  it("keeps a moved row open and the row it passed as it was", async () => {
    const { wrapper } = mountField([one, two]);
    await openRows(wrapper, 1);

    await wrapper.findAll("[data-testid='list-move-up']")[1]!.trigger("click");
    await flushPromises();

    expect(wrapper.find("#field-0-row-0-title").exists()).toBe(true);
    expect(wrapper.find("#field-0-row-1-title").exists()).toBe(false);
  });

  it("draws no drag handle", () => {
    const { wrapper } = mountField([one]);

    expect(wrapper.find("[data-testid='list-drag']").exists()).toBe(false);
  });
});
