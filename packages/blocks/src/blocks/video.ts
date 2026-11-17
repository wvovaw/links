import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock<"Video"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Video",
    properties: {
      provider: {
        id: 0,
        type: "select",
        label: "Provider",
        group: "Content",
        options: [
          { label: "YouTube", value: "youtube" },
          { label: "Vimeo", value: "vimeo" },
          { label: "TikTok", value: "tiktok" },
        ],
        defaultValue: "youtube",
      },
      url: {
        id: 1,
        type: "url",
        label: "Video link",
        hint: "A share link from the provider",
        required: true,
        group: "Content",
        defaultValue: null,
      },
      aspect: {
        id: 2,
        type: "select",
        label: "Aspect ratio",
        group: "Appearance",
        options: [
          { label: "16:9", value: "16:9" },
          { label: "9:16", value: "9:16" },
          { label: "1:1", value: "1:1" },
        ],
        defaultValue: "16:9",
      },
      autoplay: {
        id: 3,
        type: "boolean",
        label: "Autoplay",
        variant: "switch",
        group: "Playback",
        defaultValue: false,
      },
      muted: {
        id: 4,
        type: "boolean",
        label: "Muted",
        variant: "switch",
        group: "Playback",
        defaultValue: false,
      },
      loop: {
        id: 5,
        type: "boolean",
        label: "Loop",
        variant: "switch",
        group: "Playback",
        defaultValue: false,
      },
      radius: {
        id: 6,
        type: "number",
        label: "Radius",
        min: 0,
        max: 32,
        step: 1,
        group: "Appearance",
        defaultValue: 8,
      },
    },
  };
}

/** Version 0 is the schema the block ships with: there is no older shape to upgrade. */
function migrateBlock(block: IBlock): IBlock {
  return block;
}

export default {
  name: "Video" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
