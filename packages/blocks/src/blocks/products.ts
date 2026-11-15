import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock<"Products"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "Products",
    properties: {
      "items": {
        id: 0,
        type: "list",
        label: "Products",
        group: "Content",
        minItems: 1,
        maxItems: 30,
        defaultValue: [],
        itemFields: [
          {
            key: "image",
            id: 0,
            type: "image",
            label: "Image",
            defaultValue: null,
          },
          {
            key: "title",
            id: 1,
            type: "text",
            label: "Name",
            required: true,
            defaultValue: null,
          },
          {
            key: "subtitle",
            id: 2,
            type: "text",
            label: "Description",
            defaultValue: null,
          },
          {
            key: "price",
            id: 3,
            type: "text",
            label: "Price",
            hint: "Shown exactly as typed, for example от 1 999 ₽",
            defaultValue: null,
          },
          /*
            A product sells through someone else's checkout — Stripe, Gumroad, Ko-fi — so the row names
            an address rather than a price or a cart: the block links out and owns no money.
          */
          {
            key: "url",
            id: 4,
            type: "url",
            label: "Checkout link",
            hint: "Where the button leads: a payment link from Stripe, Gumroad, Ko-fi or Buy Me a Coffee",
            required: true,
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
      /*
        A select holds a string, so the count is stored as text and parsed by the renderer. The field
        offers exactly 2 and 3; anything else a stored block carries is clamped to a whole track.
      */
      "columns": {
        id: 2,
        type: "select",
        label: "Columns",
        hint: "How many products sit side by side in a grid",
        options: [
          { label: "2", value: "2" },
          { label: "3", value: "3" },
        ],
        group: "Appearance",
        defaultValue: "2",
      },
      "show-price": {
        id: 3,
        type: "boolean",
        label: "Show prices",
        hint: "When off, a card keeps everything but its price",
        variant: "switch",
        group: "Content",
        defaultValue: true,
      },
      "cta-label": {
        id: 4,
        type: "text",
        label: "Button text",
        hint: "The button opens the product's checkout in a new tab",
        group: "Content",
        defaultValue: "Buy",
      },
      "disclaimer": {
        id: 5,
        type: "text",
        label: "Footnote",
        hint: "Small text under the products, for delivery or refund terms",
        group: "Content",
        defaultValue: null,
      },
    },
  };
}

/** Version 0 is the schema the block ships with: there is no older shape to upgrade. */
function migrateBlock(block: IBlock): IBlock {
  return block;
}

export default {
  name: "Products" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
