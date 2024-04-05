import type { IBlock } from "../types";

export function createAvatar(id: string): IBlock {
  return {
    id,
    name: "Avatar",
    properties: {
      image: {
        type: "url",
        label: "Image url",
        group: "Content",
      },
      text: {
        type: "text",
        label: "Heading",
        hint: "Text under avatar",
        group: "Content",
      },
    },
  };
}
