import type { IBlock } from "../../src/types";

/**
 * A stored Paragraph as written before the version 3 migration: the `flag` property is gone and
 * `inline-padding` already steps by 1, but the text has no alignment or font size of its own.
 */
export const paragraphV2: IBlock<"Paragraph"> = {
  id: "paragraph-v2",
  version: 2,
  name: "Paragraph",
  properties: {
    "text": {
      id: 0,
      type: "text",
      label: "Paragraph text",
      multiline: true,
      maxLength: 200,
      required: true,
      group: "Content",
      defaultValue: null,
    },
    "inline-padding": {
      id: 1,
      type: "number",
      label: "Inline padding",
      min: 0,
      max: 125,
      step: 1,
      group: "Appearance",
      defaultValue: 0,
    },
  },
};
