import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock<"Avatar"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Avatar",
    properties: {
      image: {
        id: 0,
        type: "url",
        label: "Image url",
        group: "Content",
        defaultValue: null,
      },
      text: {
        id: 1,
        type: "text",
        label: "Heading",
        hint: "Text under avatar",
        group: "Content",
        defaultValue: null,
      },
    },
  };
}

function migrateBlock(block: IBlock): IBlock {
  if (!block.version)
    block.version = 0;
  return block;
}

export default {
  name: "Avatar" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
