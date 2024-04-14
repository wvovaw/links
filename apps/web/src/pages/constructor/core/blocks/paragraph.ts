import type { IBlock } from "../types";

export function createParagraph(id: string): IBlock {
  return {
    id,
    name: "Paragraph",
    properties: {
      "text": {
        type: "text",
        label: "Paragraph text",
        multiline: true,
        maxLength: 200,
        required: true,
        group: "Content",
      },
      "inline-padding": {
        type: "number",
        label: "Inline padding",
        min: 0,
        max: 125,
        step: 0.1,
        group: "Appearance",
      },
      "flag": {
        type: "boolean",
        variant: "checkbox",
        label: "Just a checkbox",
        hint: "This is just a checkbox"
      }
    },
  };
}
