import type { IBlock } from "../../src/types";

/**
 * A stored email capture as written by version 0, the schema the block ships with: a pinned starting
 * point for the migration that first changes its shape.
 */
export const emailCaptureV0: IBlock<"EmailCapture"> = {
  id: "email-capture-v0",
  version: 0,
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
