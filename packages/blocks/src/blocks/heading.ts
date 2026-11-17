import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock<"Heading"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Heading",
    properties: {
      text: {
        id: 0,
        type: "text",
        label: "Heading text",
        multiline: true,
        required: true,
        group: "Content",
        defaultValue: null,
      },
      level: {
        id: 1,
        type: "select",
        label: "Level",
        options: [
          { label: "H1", value: "h1" },
          { label: "H2", value: "h2" },
          { label: "H3", value: "h3" },
        ],
        group: "Appearance",
        defaultValue: "h2",
      },
      align: {
        id: 2,
        type: "select",
        label: "Align",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ],
        group: "Appearance",
        defaultValue: "center",
      },
    },
  };
}

/** Version 0 is the schema the block ships with: there is no older shape to upgrade. */
function migrateBlock(block: IBlock): IBlock {
  return block;
}

export default {
  name: "Heading" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
