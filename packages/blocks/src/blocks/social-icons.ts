import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 0;

/**
 * Version 0 has no older shape to upgrade, so a block of this version is already current.
 */
function migrateBlock(block: IBlock): IBlock {
  return block;
}

function createBlock(id: string): IBlock<"SocialIcons"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "SocialIcons",
    properties: {
      /*
        One url property per slot, in the order the icons render. A slot is a fixed property rather
        than a row of a repeatable list because the schema has no list type yet; an empty slot draws
        nothing, so the owner fills only the networks they are on.
      */
      telegram: {
        id: 0,
        type: "url",
        label: "Telegram",
        group: "Content",
        defaultValue: null,
      },
      instagram: {
        id: 1,
        type: "url",
        label: "Instagram",
        group: "Content",
        defaultValue: null,
      },
      youtube: {
        id: 2,
        type: "url",
        label: "YouTube",
        group: "Content",
        defaultValue: null,
      },
      tiktok: {
        id: 3,
        type: "url",
        label: "TikTok",
        group: "Content",
        defaultValue: null,
      },
      x: {
        id: 4,
        type: "url",
        label: "X",
        group: "Content",
        defaultValue: null,
      },
      vk: {
        id: 5,
        type: "url",
        label: "VK",
        group: "Content",
        defaultValue: null,
      },
      whatsapp: {
        id: 6,
        type: "url",
        label: "WhatsApp",
        group: "Content",
        defaultValue: null,
      },
      email: {
        id: 7,
        type: "url",
        label: "Email",
        /* The slot takes a bare address as well, so a fence against pasting a whole `mailto:` link is wrong. */
        hint: "An address, or a mailto: link",
        group: "Content",
        defaultValue: null,
      },
      variant: {
        id: 8,
        type: "select",
        label: "Style",
        options: [
          { label: "Filled", value: "filled" },
          { label: "Outline", value: "outline" },
          { label: "Plain", value: "plain" },
        ],
        group: "Appearance",
        defaultValue: "filled",
      },
      size: {
        id: 9,
        type: "number",
        label: "Icon size",
        min: 16,
        max: 48,
        step: 1,
        group: "Appearance",
        defaultValue: 24,
      },
      align: {
        id: 10,
        type: "select",
        label: "Alignment",
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

export default {
  name: "SocialIcons" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
