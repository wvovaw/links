import type { IBlock } from "../../src/types";

/**
 * A stored Button as written before the version 1 migration: no `border` property yet and
 * `font-size` still carries id 4, which the migration hands over to the inserted `border`.
 */
export const buttonV0: IBlock<"Button"> = {
  id: "button-v0",
  version: 0,
  name: "Button",
  properties: {
    "text": {
      id: 0,
      type: "text",
      label: "Button text",
      required: true,
      group: "Content",
      defaultValue: null,
    },
    "link": {
      id: 1,
      type: "url",
      label: "Link",
      required: true,
      group: "Content",
      defaultValue: null,
    },
    "background": {
      id: 2,
      type: "color",
      label: "Background Color",
      group: "Appearance",
      defaultValue: null,
    },
    "foreground": {
      id: 3,
      type: "color",
      label: "Text Color",
      group: "Appearance",
      defaultValue: null,
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
      defaultValue: "var(--links-theme-button-font-size-sm)",
    },
  },
};
