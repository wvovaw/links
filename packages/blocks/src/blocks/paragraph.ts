import type { IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock {
  return {
    id,
    version: BLOCK_VERSION,
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
      "flag": {
        id: 2,
        type: "boolean",
        variant: "checkbox",
        label: "Just a checkbox",
        hint: "This is just a checkbox",
        defaultValue: true,
      },
    },
  };
}

function migrateBlock(block: IBlock): IBlock {
  return block;
}

export default {
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
};
