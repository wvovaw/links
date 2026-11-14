import type { BlockModuleSchema, IBlock, IBlockPropertyImage } from "../types";

const BLOCK_VERSION = 1;

function createBlock(id: string): IBlock<"Avatar"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Avatar",
    properties: {
      image: {
        id: 0,
        type: "image",
        label: "Image",
        group: "Content",
        defaultValue: null,
      },
      text: {
        id: 1,
        type: "text",
        label: "Heading",
        hint: "Text under avatar",
        group: "Content",
        defaultValue: null,
      },
      size: {
        id: 2,
        type: "number",
        label: "Size",
        min: 40,
        max: 240,
        step: 1,
        group: "Appearance",
        defaultValue: 100,
      },
      shape: {
        id: 3,
        type: "select",
        label: "Shape",
        options: [
          { label: "Circle", value: "circle" },
          { label: "Rounded", value: "rounded" },
        ],
        group: "Appearance",
        defaultValue: "circle",
      },
      link: {
        id: 4,
        type: "url",
        label: "Link",
        group: "Content",
        defaultValue: null,
      },
    },
  };
}

function migrateBlock(block: IBlock): IBlock {
  if (!block.version) block.version = 0;

  if (block.version === 0) {
    /* The stored value survives as-is: `image` only stops being a hand-pasted url and becomes an
       upload, so the constructor offers the uploader instead of a text input. */
    const image = block.properties.image as unknown as IBlockPropertyImage;
    image.type = "image";
    image.label = "Image";
    block.properties.size = {
      id: 2,
      type: "number",
      label: "Size",
      min: 40,
      max: 240,
      step: 1,
      group: "Appearance",
      defaultValue: 100,
    };
    block.properties.shape = {
      id: 3,
      type: "select",
      label: "Shape",
      options: [
        { label: "Circle", value: "circle" },
        { label: "Rounded", value: "rounded" },
      ],
      group: "Appearance",
      defaultValue: "circle",
    };
    block.properties.link = {
      id: 4,
      type: "url",
      label: "Link",
      group: "Content",
      defaultValue: null,
    };
    block.version = 1;
  }

  return block;
}

export default {
  name: "Avatar" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
