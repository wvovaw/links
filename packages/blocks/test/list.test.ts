import { describe, expect, it } from "vitest";

import type { IBlockPropertyList } from "../src/main";

import { completeRows, listRows } from "../src/main";

const property: IBlockPropertyList = {
  id: 0,
  type: "list",
  label: "Rows",
  defaultValue: [],
  itemFields: [
    { key: "title", id: 0, type: "text", label: "Title", defaultValue: null },
    { key: "link", id: 1, type: "url", label: "Link", defaultValue: null },
  ],
};

describe("listRows", () => {
  it("returns an empty array for a missing or non-array value", () => {
    expect(listRows({ ...property, value: undefined })).toEqual([]);
    expect(listRows({ ...property, value: "nope" as never })).toEqual([]);
  });
});

describe("completeRows", () => {
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
