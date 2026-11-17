import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock<"Spacer"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Spacer",
    properties: {
      height: {
        id: 0,
        type: "number",
        label: "Height",
        min: 0,
        max: 200,
        step: 1,
        group: "Appearance",
        defaultValue: 24,
      },
    },
  };
}

/** Version 0 is the schema the block ships with: there is no older shape to upgrade. */
function migrateBlock(block: IBlock): IBlock {
  return block;
}

export default {
  name: "Spacer" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
