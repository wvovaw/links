import { describe, expect, it } from "vitest";

import type { IBlockPropertyList } from "../src/main";

import { completeRows, itemFieldsOf, listRows, requiredItemKeys } from "../src/main";

const property: IBlockPropertyList = {
  id: 0,
  type: "list",
  label: "Rows",
  defaultValue: [],
  itemFields: [
    { key: "title", id: 0, type: "text", label: "Title", required: true, defaultValue: null },
    { key: "link", id: 1, type: "url", label: "Link", required: true, defaultValue: null },
    { key: "note", id: 2, type: "text", label: "Note", defaultValue: null },
  ],
};

describe("itemFieldsOf", () => {
  /*
    A property definition is stored JSON too: the API takes `blocks` as unknown, so a list saved
    without its item fields must read as a list with none rather than break a save or a panel.
  */
  it("returns an empty array for item fields that are missing or are not an array", () => {
    expect(itemFieldsOf({ ...property, itemFields: undefined as never })).toEqual([]);
    expect(itemFieldsOf({ ...property, itemFields: "title" as never })).toEqual([]);
    expect(itemFieldsOf(undefined)).toEqual([]);
  });

  it("returns the declared fields as they are", () => {
    expect(itemFieldsOf(property)).toBe(property.itemFields);
  });
});

describe("requiredItemKeys", () => {
  it("names the item fields the schema marks required", () => {
    expect(requiredItemKeys(property)).toEqual(["title", "link"]);
    expect(requiredItemKeys({ ...property, itemFields: [] })).toEqual([]);
  });
});

describe("listRows", () => {
  it("returns an empty array for a missing or non-array value", () => {
    expect(listRows({ ...property, value: undefined })).toEqual([]);
    expect(listRows({ ...property, value: "nope" as never })).toEqual([]);
  });
});

describe("completeRows", () => {
  it("filters by the property's own required item fields when no keys are passed", () => {
    const value = [
      { title: "One", link: "https://a.example", note: "kept although optional" },
      { title: "Two", link: "" },
      { title: "Three" },
    ];

    expect(completeRows({ ...property, value })).toEqual([
      { title: "One", link: "https://a.example", note: "kept although optional" },
    ]);
  });

  it("keeps every row when the schema requires nothing of them, and does not throw without item fields", () => {
    expect(completeRows({ ...property, itemFields: undefined as never, value: [{ note: "solo" }] })).toEqual([
      { note: "solo" },
    ]);
  });

  it("keeps only rows whose required keys have content", () => {
    const value = [
      { title: "One", link: "https://a.example" },
      { title: "Two", link: "" },
      { title: "   ", link: "https://c.example" },
      {},
    ];

    expect(completeRows({ ...property, value }, ["title", "link"])).toEqual([
      { title: "One", link: "https://a.example" },
    ]);
  });

  it("does not mutate the stored value", () => {
    const value = [{ title: "One", link: "https://a.example" }];
    completeRows({ ...property, value }, ["title"]);

    expect(value).toEqual([{ title: "One", link: "https://a.example" }]);
  });

  it("keeps keys the item schema does not declare", () => {
    const value = [{ title: "One", link: "https://a.example", discount: "SAVE10" }];

    expect(completeRows({ ...property, value }, ["title"])).toEqual(value);
  });
});
