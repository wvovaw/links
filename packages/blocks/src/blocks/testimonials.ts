import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock<"Testimonials"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Testimonials",
    properties: {
      "items": {
        id: 0,
        type: "list",
        label: "Testimonials",
        group: "Content",
        minItems: 1,
        maxItems: 20,
        defaultValue: [],
        itemFields: [
          {
            key: "quote",
            id: 0,
            type: "text",
            label: "Quote",
            multiline: true,
            required: true,
            defaultValue: null,
          },
          {
            key: "author",
            id: 1,
            type: "text",
            label: "Author",
            defaultValue: null,
          },
          {
            key: "role",
            id: 2,
            type: "text",
            label: "Role",
            defaultValue: null,
          },
          {
            key: "avatar",
            id: 3,
            type: "image",
            label: "Avatar",
            defaultValue: null,
          },
          /*
            The stars are drawn as a whole number of five, so the field offers steps of one: a stored
            value outside 1–5, or a fraction, is clamped by the renderer rather than trusted.
          */
          {
            key: "rating",
            id: 4,
            type: "number",
            label: "Rating",
            hint: "Stars out of five",
            min: 1,
            max: 5,
            step: 1,
            defaultValue: null,
          },
        ],
      },
      "layout": {
        id: 1,
        type: "select",
        label: "Layout",
        options: [
          { label: "List", value: "list" },
          { label: "Grid", value: "grid" },
        ],
        group: "Appearance",
        defaultValue: "list",
      },
      "show-rating": {
        id: 2,
        type: "boolean",
        label: "Show ratings",
        hint: "When off, a quote keeps everything but its stars",
        variant: "switch",
        group: "Content",
        defaultValue: false,
      },
    },
  };
}

/** Version 0 is the schema the block ships with: there is no older shape to upgrade. */
function migrateBlock(block: IBlock): IBlock {
  return block;
}

export default {
  name: "Testimonials" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
