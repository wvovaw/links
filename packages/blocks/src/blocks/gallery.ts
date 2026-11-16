import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 1;

function createBlock(id: string): IBlock<"Gallery"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Gallery",
    properties: {
      items: {
        id: 0,
        type: "list",
        label: "Images",
        group: "Content",
        minItems: 1,
        maxItems: 30,
        defaultValue: [],
        itemFields: [
          {
            key: "image",
            id: 0,
            type: "image",
            label: "Image",
            required: true,
            defaultValue: null,
          },
          {
            key: "alt",
            id: 1,
            type: "text",
            label: "Alt text",
            hint: "Describes the picture when it cannot be seen",
            defaultValue: "",
          },
          {
            key: "link",
            id: 2,
            type: "url",
            label: "Link",
            defaultValue: null,
          },
        ],
      },
      layout: {
        id: 1,
        type: "select",
        label: "Layout",
        options: [
          { label: "Grid", value: "grid" },
          { label: "Carousel", value: "carousel" },
        ],
        group: "Appearance",
        defaultValue: "grid",
      },
      /*
        A select holds a string, so the count is stored as text and parsed by the renderer. The field
        offers exactly 1, 2, 3 and 4; anything else a stored block carries is clamped to a whole track.
      */
      columns: {
        id: 2,
        type: "select",
        label: "Columns",
        hint: "How many images sit side by side in a grid; the carousel shows one at a time",

        options: [
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
        ],
        group: "Appearance",
        defaultValue: "2",
      },
      aspect: {
        id: 3,
        type: "select",
        label: "Image shape",
        options: [
          { label: "Square", value: "1:1" },
          { label: "Landscape", value: "4:3" },
          { label: "Wide", value: "16:9" },
        ],
        group: "Appearance",
        defaultValue: "1:1",
      },
      radius: {
        id: 4,
        type: "number",
        label: "Radius",
        min: 0,
        max: 32,
        step: 1,
        group: "Appearance",
        defaultValue: 10,
      },
    },
  };
}

/**
 * Version 1 renames the horizontal layout: the strip scrolled a row of two-image frames, and the
 * carousel that replaced it steps one image at a time. The options are rewritten in place on the
 * stored property, so a page keeps the layout it chose — `strip` moving to the value that replaced it.
 */
function migrateBlock(block: IBlock): IBlock {
  if (!block.version) block.version = 0;

  if (block.version === 0) {
    const layout = block.properties.layout;
    if (layout?.type === "select") {
      layout.options = [
        { label: "Grid", value: "grid" },
        { label: "Carousel", value: "carousel" },
      ];
      if (layout.value === "strip") layout.value = "carousel";
    }

    const columns = block.properties.columns;
    if (columns?.type === "select") {
      columns.hint = "How many images sit side by side in a grid; the carousel shows one at a time";
      columns.options = [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
      ];
    }

    block.version = 1;
  }

  return block;
}

export default {
  name: "Gallery" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
