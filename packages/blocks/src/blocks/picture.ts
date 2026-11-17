import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 1;

function createBlock(id: string): IBlock<"Picture"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Picture",
    properties: {
      "image": {
        id: 0,
        type: "image",
        label: "Image",
        group: "Content",
        defaultValue: null,
      },
      "alt": {
        id: 1,
        type: "text",
        label: "Alt text",
        hint: "Describes the picture when it cannot be seen",
        group: "Content",
        defaultValue: "",
      },
      "loading": {
        id: 2,
        type: "select",
        label: "Loading",
        options: [
          { label: "Lazy", value: "lazy" },
          { label: "Eager", value: "eager" },
        ],
        group: "Appearance",
        defaultValue: "lazy",
      },
      "object-fit": {
        id: 3,
        type: "select",
        label: "Object fit",
        options: [
          { label: "Cover", value: "cover" },
          { label: "Contain", value: "contain" },
        ],
        group: "Appearance",
        defaultValue: "cover",
      },
      "link": {
        id: 4,
        type: "url",
        label: "Link",
        group: "Content",
        defaultValue: null,
      },
      "radius": {
        id: 5,
        type: "number",
        label: "Radius",
        min: 0,
        max: 40,
        step: 1,
        group: "Appearance",
        defaultValue: 10,
      },
    },
  };
}

function migrateBlock(block: IBlock): IBlock {
  if (!block.version) block.version = 0;

  if (block.version === 0) {
    block.properties.alt = {
      id: 1,
      type: "text",
      label: "Alt text",
      hint: "Describes the picture when it cannot be seen",
      group: "Content",
      defaultValue: "",
    };
    block.properties.loading = {
      id: 2,
      type: "select",
      label: "Loading",
      options: [
        { label: "Lazy", value: "lazy" },
        { label: "Eager", value: "eager" },
      ],
      group: "Appearance",
      defaultValue: "lazy",
    };
    block.properties["object-fit"] = {
      id: 3,
      type: "select",
      label: "Object fit",
      options: [
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
      ],
      group: "Appearance",
      defaultValue: "cover",
    };
    block.properties.link = {
      id: 4,
      type: "url",
      label: "Link",
      group: "Content",
      defaultValue: null,
    };
    block.properties.radius = {
      id: 5,
      type: "number",
      label: "Radius",
      min: 0,
      max: 40,
      step: 1,
      group: "Appearance",
      defaultValue: 10,
    };
    block.version = 1;
  }

  return block;
}

export default {
  name: "Picture" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
