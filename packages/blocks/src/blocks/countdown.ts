import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock<"Countdown"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Countdown",
    properties: {
      "target": {
        id: 0,
        type: "date",
        label: "Target date",
        hint: "The moment the countdown reaches zero, in the browser's own timezone",
        withTime: true,
        required: true,
        group: "Content",
        defaultValue: null,
      },
      "title": {
        id: 1,
        type: "text",
        label: "Title",
        group: "Content",
        defaultValue: null,
      },
      "finished-text": {
        id: 2,
        type: "text",
        label: "Finished text",
        group: "Content",
        defaultValue: "The countdown has finished",
      },
      "variant": {
        id: 3,
        type: "select",
        label: "Style",
        group: "Appearance",
        options: [
          { label: "Box", value: "box" },
          { label: "Plain", value: "plain" },
        ],
        defaultValue: "box",
      },
      "hide-after-finish": {
        id: 4,
        type: "boolean",
        label: "Hide after the countdown finishes",
        variant: "switch",
        group: "Appearance",
        defaultValue: false,
      },
    },
  };
}

/** Version 0 is the schema the block ships with: there is no older shape to upgrade. */
function migrateBlock(block: IBlock): IBlock {
  return block;
}

export default {
  name: "Countdown" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
