import type { IBlock } from "../../src/types";

/**
 * A stored FAQ as written by version 0, the schema the block ships with: a pinned starting point for
 * the migration that first changes an item's shape.
 */
export const faqV0: IBlock<"Faq"> = {
  id: "faq-v0",
  version: 0,
  name: "Faq",
  properties: {
    "title": {
      id: 0,
      type: "text",
      label: "Section title",
      hint: "Shown above the questions",
      group: "Content",
      defaultValue: null,
    },
    "items": {
      id: 1,
      type: "list",
      label: "Questions",
      group: "Content",
      minItems: 1,
      maxItems: 40,
      defaultValue: [],
      itemFields: [
        {
          key: "question",
          id: 0,
          type: "text",
          label: "Question",
          required: true,
          defaultValue: null,
        },
        {
          key: "answer",
          id: 1,
          type: "text",
          label: "Answer",
          multiline: true,
          required: true,
          defaultValue: null,
        },
      ],
    },
    "allow-multiple": {
      id: 2,
      type: "boolean",
      label: "Allow several answers open",
      hint: "When off, opening an answer closes the others.",
      variant: "switch",
      group: "Behaviour",
      defaultValue: false,
    },
    "divider-style": {
      id: 3,
      type: "select",
      label: "Divider",
      options: [
        { label: "Line", value: "line" },
        { label: "Filled", value: "filled" },
        { label: "None", value: "none" },
      ],
      group: "Appearance",
      defaultValue: "line",
    },
  },
};
