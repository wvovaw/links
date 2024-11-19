import type { IBlock, IBlockPropertyNumber } from "../types";

const BLOCK_VERSION = 2;

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
    },
  };
}

function migrateBlock(block: IBlock): IBlock {
  if (!block.version)
    block.version = 0;

  if (block.version === 0) {
    (block.properties["inline-padding"] as unknown as IBlockPropertyNumber).step = 1;
    block.version = 1;
  }
  if (block.version === 1) {
    delete block.properties.flag;
    block.version = 2;
  }

  return block;
}

export default {
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
};
