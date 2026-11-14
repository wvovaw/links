import type { IBlock } from "../../src/types";

/**
 * A stored Button as written before the version 2 migration: `border` and `font-size` are there,
 * but the link has no `new-tab` switch and always opened in a new tab.
 */
export const buttonV1: IBlock<"Button"> = {
  id: "button-v1",
  version: 1,
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
    "border": {
      id: 4,
      type: "color",
      label: "Border Color",
      group: "Border",
      defaultValue: null,
    },
    "font-size": {
      id: 5,
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
