import type { IBlock } from "../../src/types";

/**
 * A stored contact form as written by version 0, the schema the block ships with: a pinned starting
 * point for the migration that first changes its shape.
 */
export const contactFormV0: IBlock<"ContactForm"> = {
  id: "contact-form-v0",
  version: 0,
  name: "ContactForm",
  properties: {
    "title": {
      id: 0,
      type: "text",
      label: "Title",
      group: "Content",
      defaultValue: null,
    },
    "description": {
      id: 1,
      type: "text",
      label: "Description",
      multiline: true,
      group: "Content",
      defaultValue: null,
    },
    "fields": {
      id: 2,
      type: "select",
      label: "Fields",
      hint: "The optional fields a visitor fills in. The email address is always asked for, so the owner can answer.",
      isMultiple: true,
      options: [
        { label: "Name", value: "name" },
        { label: "Message", value: "message" },
      ],
      group: "Content",
      defaultValue: ["name", "message"],
    },
    "button-label": {
      id: 3,
      type: "text",
      label: "Button label",
      group: "Form",
      defaultValue: "Send",
    },
    "success-message": {
      id: 4,
      type: "text",
      label: "Success message",
      hint: "Shown instead of the form once a message is stored",
      group: "Form",
      defaultValue: "Thank you, we will get back to you",
    },
  },
};
