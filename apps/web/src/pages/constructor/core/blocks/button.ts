import type { IBlock } from "../types";

export function createButton(id: string): IBlock {
  return {
    id,
    name: "Button",
    properties: {
      "text": {
        type: "text",
        label: "Button text",
        required: true,
        group: "Content",
      },
      "link": {
        type: "url",
        label: "Link",
        required: true,
        group: "Content",
      },
      "background": {
        type: "color",
        label: "Background Color",
        group: "Appearance",
      },
      "foreground": {
        type: "color",
        label: "Text Color",
        group: "Appearance",
      },
      "font-size": {
        type: "select",
        label: "Font size",
        options: [
          { label: "sm", value: "var(--links-theme-button-font-size-sm)" },
          { label: "md", value: "var(--links-theme-button-font-size-md)" },
          { label: "lg", value: "var(--links-theme-button-font-size-lg)" },
        ],
        group: "Appearance",
      },
      "adult-confirmation": {
        type: "boolean",
        variant: "switch",
        label: "Adult confirmation",
        hint: "Asks the user to confirm his action"
      },
    },
  };
}
