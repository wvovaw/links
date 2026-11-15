import type { BlockModuleSchema, BlockProperty, IBlock, IBlockPropertyColor, IBlockPropertySelect } from "../types";

import { LINK_ICONS } from "../types";

const BLOCK_VERSION = 3;

/**
 * The link-card properties the version 3 migration adds. One list serves both the factory and the
 * migration, so a stored Button ends up with exactly the shape `createBlock` writes today.
 */
function cardProperties(): Record<string, BlockProperty> {
  return {
    thumbnail: {
      id: 7,
      type: "image",
      label: "Thumbnail",
      group: "Content",
      defaultValue: null,
    },
    subtitle: {
      id: 8,
      type: "text",
      label: "Subtitle",
      group: "Content",
      defaultValue: null,
    },
    icon: {
      id: 9,
      type: "select",
      label: "Icon",
      options: linkIconOptions(),
      group: "Content",
      defaultValue: null,
    },
    variant: {
      id: 10,
      type: "select",
      label: "Style",
      options: [
        { label: "Page default", value: "inherit" },
        { label: "Solid", value: "solid" },
        { label: "Outline", value: "outline" },
        { label: "Ghost", value: "ghost" },
      ],
      group: "Appearance",
      defaultValue: null,
    },
    height: {
      id: 11,
      type: "number",
      label: "Height",
      min: 40,
      max: 96,
      step: 1,
      group: "Appearance",
      defaultValue: 56,
    },
    radius: {
      id: 12,
      type: "number",
      label: "Radius",
      min: 0,
      max: 32,
      step: 1,
      group: "Appearance",
      defaultValue: 8,
    },
  };
}

/**
 * Only safelisted link icons are offered: UnoCSS emits no class for any name outside `BLOCK_ICONS`, so
 * a wider list would render an empty box with no error. `LINK_ICONS` keeps that safelist from deciding
 * which icons belong on a link card. `none` is the option that clears the icon, the same way `Page
 * default` clears the variant — a select cannot carry the empty string as a value.
 */
function linkIconOptions(): IBlockPropertySelect["options"] {
  return [
    { label: "None", value: "none" },
    ...LINK_ICONS.map((icon) => {
      const name = icon.slice(icon.indexOf(":") + 1).replaceAll("-", " ");

      return { label: name.charAt(0).toUpperCase() + name.slice(1), value: icon };
    }),
  ];
}

function createBlock(id: string): IBlock<"Button"> {
  return {
    id,
    version: BLOCK_VERSION,
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
      "new-tab": {
        id: 6,
        type: "boolean",
        label: "Open in a new tab",
        variant: "switch",
        group: "Content",
        defaultValue: true,
      },
      ...cardProperties(),
    },
  };
}

function migrateBlock(block: IBlock): IBlock {
  if (!block.version) block.version = 0;
  if (block.version === 0) {
    // Read the next free id before `border` takes a slot, so `font-size` lands on the id the
    // current schema pins (5) rather than on the post-insert property count (6).
    const nextId = Object.keys(block.properties).length;
    (block.properties.border as unknown as IBlockPropertyColor) = {
      id: block.properties["font-size"].id,
      type: "color",
      label: "Border Color",
      group: "Border",
      defaultValue: null,
    };
    (block.properties["font-size"] as unknown as IBlockPropertySelect).id = nextId;
    block.version = 1;
  }
  if (block.version === 1) {
    block.properties["new-tab"] = {
      id: 6,
      type: "boolean",
      label: "Open in a new tab",
      variant: "switch",
      group: "Content",
      defaultValue: true,
    };
    block.version = 2;
  }
  if (block.version === 2) {
    /* A stored button keeps every value it has: only the properties it never had are filled in. */
    for (const [name, property] of Object.entries(cardProperties())) {
      block.properties[name] ??= property;
    }
    block.version = 3;
  }

  return block;
}

export default {
  name: "Button" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
