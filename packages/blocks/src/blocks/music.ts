import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock<"Music"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Music",
    properties: {
      provider: {
        id: 0,
        type: "select",
        label: "Provider",
        group: "Content",
        options: [
          { label: "Spotify", value: "spotify" },
          { label: "SoundCloud", value: "soundcloud" },
          { label: "Apple Music", value: "apple-music" },
          { label: "YouTube Music", value: "youtube-music" },
        ],
        defaultValue: "spotify",
      },
      url: {
        id: 1,
        type: "url",
        label: "Music link",
        hint: "A share link from the provider",
        required: true,
        group: "Content",
        defaultValue: null,
      },
      height: {
        id: 2,
        type: "select",
        label: "Height",
        group: "Appearance",
        options: [
          { label: "Compact", value: "compact" },
          { label: "Full", value: "full" },
        ],
        defaultValue: "compact",
      },
    },
  };
}

/** Version 0 is the schema the block ships with: there is no older shape to upgrade. */
function migrateBlock(block: IBlock): IBlock {
  return block;
}

export default {
  name: "Music" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
