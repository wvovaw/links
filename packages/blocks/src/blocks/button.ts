import type { IBlock, IBlockPropertyColor, IBlockPropertySelect } from "../types";

const BLOCK_VERSION = 1;

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
      "border": {
        id: 4,
        type: "color",
        label: "Border Color",
        group: "Border",
        defaultValue: null,
      },
      "font-size": {
        id: 5,
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
    },
  };
}

function migrateBlock(block: IBlock): IBlock {
  if (!block.version)
    block.version = 0;
  if (block.version === 0) {
    (block.properties.border as unknown as IBlockPropertyColor) = {
      id: block.properties["font-size"].id,
      type: "color",
      label: "Border Color",
      group: "Border",
      defaultValue: null,
    };
    (block.properties["font-size"] as unknown as IBlockPropertySelect).id = Object.keys(block.properties).length;
    block.version = 1;
  }

  return block;
}

export default {
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
};
