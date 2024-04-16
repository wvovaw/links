import type { IBlock } from "../types";

export function createAvatar(id: string): IBlock {
  return {
    id,
    name: "Avatar",
    properties: {
      image: {
        id: 0,
        type: "url",
        label: "Image url",
        group: "Content",
      },
      text: {
        id: 1,
        type: "text",
        label: "Heading",
        hint: "Text under avatar",
        group: "Content",
      },
    },
  };
}
