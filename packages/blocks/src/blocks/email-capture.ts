import type { BlockModuleSchema, IBlock } from "../types";

const BLOCK_VERSION = 0;

function createBlock(id: string): IBlock<"EmailCapture"> {
  return {
    id,
    version: BLOCK_VERSION,
    name: "EmailCapture",
    properties: {
      "title": {
        id: 0,
        type: "text",
        label: "Title",
        group: "Content",
        defaultValue: null,
      },
      "placeholder": {
        id: 1,
        type: "text",
        label: "Placeholder",
        group: "Content",
        defaultValue: "Your email",
      },
      "button-label": {
        id: 2,
        type: "text",
        label: "Button label",
        group: "Form",
        defaultValue: "Subscribe",
      },
      "success-message": {
        id: 3,
        type: "text",
        label: "Success message",
        hint: "Shown instead of the form once an address is stored",
        group: "Form",
        defaultValue: "Thank you, your address is saved",
      },
    },
  };
}

/** Version 0 is the schema the block ships with: there is no older shape to upgrade. */
function migrateBlock(block: IBlock): IBlock {
  return block;
}

export default {
  name: "EmailCapture" as const,
  BLOCK_VERSION,
  createBlock,
  migrateBlock,
} satisfies BlockModuleSchema;
