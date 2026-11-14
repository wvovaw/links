import type { BlockModuleSchema, IBlock, IBlockPropertyNumber } from "../types";

const BLOCK_VERSION = 3;

function createBlock(id: string): IBlock<"Paragraph"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Paragraph",
    properties: {
      "text": {
        id: 0,
        type: "text",
        label: "Paragraph text",
        multiline: true,
        maxLength: 200,
        required: true,
        group: "Content",
        defaultValue: null,
      },
      "inline-padding": {
        id: 1,
        type: "number",
        label: "Inline padding",
        min: 0,
        max: 125,
        step: 1,
        group: "Appearance",
        defaultValue: 0,
      },
      "align": {
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
      "font-size": {
        id: 3,
        type: "select",
        label: "Font size",
        options: [
          { label: "sm", value: "var(--links-theme-paragraph-font-size-sm)" },
          { label: "md", value: "var(--links-theme-paragraph-font-size-md)" },
          { label: "lg", value: "var(--links-theme-paragraph-font-size-lg)" },
        ],
        group: "Appearance",
        defaultValue: "var(--links-theme-paragraph-font-size-md)",
      },
    },
  };
}

function migrateBlock(block: IBlock): IBlock {
  if (!block.version) block.version = 0;

  if (block.version === 0) {
    (block.properties["inline-padding"] as unknown as IBlockPropertyNumber).step = 1;
    block.version = 1;
  }
  if (block.version === 1) {
    delete block.properties.flag;
    block.version = 2;
  }
  if (block.version === 2) {
    block.properties.align = {
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
    };
    block.properties["font-size"] = {
      id: 3,
      type: "select",
      label: "Font size",
      options: [
        { label: "sm", value: "var(--links-theme-paragraph-font-size-sm)" },
        { label: "md", value: "var(--links-theme-paragraph-font-size-md)" },
        { label: "lg", value: "var(--links-theme-paragraph-font-size-lg)" },
      ],
      group: "Appearance",
      defaultValue: "var(--links-theme-paragraph-font-size-md)",
    };
    block.version = 3;
  }

  return block;
}

export default {
  name: "Paragraph" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
