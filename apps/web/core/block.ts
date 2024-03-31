import type { BlockName, IBlock } from "./types";

export const blocksList = [
  { name: "Button" },
  { name: "Paragraph" },
  { name: "Avatar" },
] as const;

export function createBlock(name: BlockName, id: string): IBlock {
  if (name === "Button")
    return createButton(id);
  else if (name === "Paragraph")
    return createParagraph(id);

  else throw new Error("Unknown block name");
}

function createButton(id: string): IBlock {
  return {
    id,
    name: "Button",
    properties: {
      text: {
        type: "string",
        label: "Button text",
        required: true,
        group: "Content",
      },
      link: {
        type: "url",
        label: "Link",
        required: true,
        group: "Content",
      },
      background: {
        type: "color",
        label: "Background Color",
        group: "Appearance",
      },
      foreground: {
        type: "color",
        label: "Text Color",
        group: "Appearance",
      },
      foo: {
        type: "select",
        label: "Select One",
      }
    },
  };
}

function createParagraph(id: string): IBlock {
  return {
    id,
    name: "Paragraph",
    properties: {
      text: {
        type: "text",
        label: "Paragraph text",
        required: true,
      },
    },
  };
}
