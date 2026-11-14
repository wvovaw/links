import type { IBlock } from "../../src/types";

/**
 * A stored Paragraph as written before the version 1 and 2 migrations: `inline-padding` still steps
 * by 2 and a `flag` property still exists. Kept hand-written on purpose — regenerating it from
 * `createBlock` would make the pinned-history case pass without any migration running.
 */
export const paragraphV0: IBlock<"Paragraph"> = {
  id: "paragraph-v0",
  version: 0,
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
      step: 2,
      group: "Appearance",
      defaultValue: 0,
    },
    "flag": {
      id: 2,
      type: "boolean",
      label: "Flag",
      variant: "switch",
      group: "Appearance",
      defaultValue: false,
    },
  },
};
