import type { IBlock } from "../../src/types";

/**
 * A stored testimonials block as written by version 0, the schema the block ships with: a pinned
 * starting point for the first migration that changes an item's shape.
 */
export const testimonialsV0: IBlock<"Testimonials"> = {
  id: "testimonials-v0",
  version: 0,
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
