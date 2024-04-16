import type { IBlock } from "../types";

export function createButton(id: string): IBlock {
  return {
    id,
    name: "Button",
    properties: {
      "text": {
        id: 0,
        type: "text",
        label: "Button text",
        required: true,
        group: "Content",
      },
      "link": {
        id: 1,
        type: "url",
        label: "Link",
        required: true,
        group: "Content",
      },
      "background": {
        id: 2,
        type: "color",
        label: "Background Color",
        group: "Appearance",
      },
      "foreground": {
        id: 3,
        type: "color",
        label: "Text Color",
        group: "Appearance",
      },
      "font-size": {
        id: 4,
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
        id: 5,
        type: "boolean",
        variant: "switch",
        label: "Adult confirmation",
        hint: "Asks the user to confirm his action"
      },
    },
  };
}
