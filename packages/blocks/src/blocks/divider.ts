import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock<"Divider"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Divider",
    properties: {
      style: {
        id: 0,
        type: "select",
        label: "Style",
        options: [
          { label: "Line", value: "line" },
          { label: "Dashed", value: "dashed" },
          { label: "Dotted", value: "dotted" },
          { label: "Space", value: "space" },
        ],
        group: "Appearance",
        defaultValue: "line",
      },
      color: {
        id: 1,
        type: "color",
        label: "Color",
        group: "Appearance",
        defaultValue: null,
      },
      spacing: {
        id: 2,
        type: "number",
        label: "Spacing",
        min: 0,
        max: 64,
        step: 1,
        group: "Appearance",
        defaultValue: 16,
      },
    },
  };
}

/** Version 0 is the schema the block ships with: there is no older shape to upgrade. */
function migrateBlock(block: IBlock): IBlock {
  return block;
}

export default {
  name: "Divider" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
