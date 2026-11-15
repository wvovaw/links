import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock<"Map"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Map",
    properties: {
      "address": {
        id: 0,
        type: "text",
        label: "Address",
        hint: "A street address, a place name or coordinates",
        multiline: true,
        required: true,
        group: "Content",
        defaultValue: null,
      },
      "zoom": {
        id: 1,
        type: "number",
        label: "Zoom",
        min: 1,
        max: 20,
        step: 1,
        group: "Appearance",
        defaultValue: 15,
      },
      "height": {
        id: 2,
        type: "number",
        label: "Height",
        min: 120,
        max: 400,
        step: 1,
        group: "Appearance",
        defaultValue: 240,
      },
      "caption": {
        id: 3,
        type: "text",
        label: "Caption",
        group: "Content",
        defaultValue: null,
      },
      "show-link": {
        id: 4,
        type: "boolean",
        label: "Open in maps link",
        variant: "switch",
        group: "Content",
        defaultValue: true,
      },
    },
  };
}

/** Version 0 is the schema the block ships with: there is no older shape to upgrade. */
function migrateBlock(block: IBlock): IBlock {
  return block;
}

export default {
  name: "Map" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
