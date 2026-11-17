import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock<"QrCode"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "QrCode",
    properties: {
      url: {
        id: 0,
        type: "url",
        label: "Link",
        hint: "What a scan opens; leave it empty to use this page's own address",
        group: "Content",
        defaultValue: null,
      },
      caption: {
        id: 1,
        type: "text",
        label: "Caption",
        group: "Content",
        defaultValue: null,
      },
      size: {
        id: 2,
        type: "number",
        label: "Size",
        min: 80,
        max: 320,
        step: 1,
        group: "Appearance",
        defaultValue: 160,
      },
      foreground: {
        id: 3,
        type: "color",
        label: "Code colour",
        group: "Appearance",
        defaultValue: "#171515",
      },
      background: {
        id: 4,
        type: "color",
        label: "Background colour",
        group: "Appearance",
        defaultValue: "#ffffff",
      },
    },
  };
}

/** Version 0 is the schema the block ships with: there is no older shape to upgrade. */
function migrateBlock(block: IBlock): IBlock {
  return block;
}

export default {
  name: "QrCode" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
