import type { IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Button",
    properties: {
      "text": {
        id: 0,
        type: "text",
        label: "Button text",
        required: true,
        group: "Content",
        defaultValue: null,
      },
      "link": {
        id: 1,
        type: "url",
        label: "Link",
        required: true,
        group: "Content",
        defaultValue: null,
      },
      "background": {
        id: 2,
        type: "color",
        label: "Background Color",
        group: "Appearance",
        defaultValue: null,
      },
      "foreground": {
        id: 3,
        type: "color",
        label: "Text Color",
        group: "Appearance",
        defaultValue: null,
      },
      "font-size": {
        id: 4,
        type: "select",
        label: "Font size",
        options: [
          { label: "sm", value: "var(--links-theme-button-font-size-sm)" },
          { label: "md", value: "var(--links-theme-button-font-size-md)" },
          { label: "lg", value: "var(--links-theme-button-font-size-lg)" },
        ],
        group: "Appearance",
        defaultValue: "var(--links-theme-button-font-size-sm)",
      },
      "adult-confirmation": {
        id: 5,
        type: "boolean",
        variant: "switch",
        label: "Adult confirmation",
        hint: "Asks the user to confirm his action",
        defaultValue: false,
      },
    },
  };
}

function migrateBlock(block: IBlock): IBlock {
  return block;
}

export default {
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
};
