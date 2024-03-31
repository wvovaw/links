import type { BlockName, IBlock } from "../types";
import { createButton } from "./button";
import { createParagraph } from "./paragraph";

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
