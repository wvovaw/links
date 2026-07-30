import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock<"Picture"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Picture",
    properties: {
      image: {
        id: 0,
        type: "image",
        label: "Image",
        group: "Content",
        defaultValue: null,
      },
    },
  };
}

function migrateBlock(block: IBlock): IBlock {
  if (!block.version) block.version = 0;
  return block;
}

export default {
  name: "Picture" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
