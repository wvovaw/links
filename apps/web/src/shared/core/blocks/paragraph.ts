import type { IBlock } from "../types";

export function createParagraph(id: string): IBlock {
  return {
    id,
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
      },
      "inline-padding": {
        id: 1,
        type: "number",
        label: "Inline padding",
        min: 0,
        max: 125,
        step: 0.1,
        group: "Appearance",
      },
      "flag": {
        id: 2,
        type: "boolean",
        variant: "checkbox",
        label: "Just a checkbox",
        hint: "This is just a checkbox",
      },
    },
  };
}
