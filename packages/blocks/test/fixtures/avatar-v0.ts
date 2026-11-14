import type { IBlock } from "../../src/types";

/**
 * A stored Avatar as written before the version 1 migration: `image` is still a plain url property
 * rather than an uploaded image, and the block knows nothing about its size, shape or link.
 */
export const avatarV0: IBlock<"Avatar"> = {
  id: "avatar-v0",
  version: 0,
  name: "Avatar",
  properties: {
    image: {
      id: 0,
      type: "url",
      label: "Image url",
      group: "Content",
      defaultValue: null,
    },
    text: {
      id: 1,
      type: "text",
      label: "Heading",
      hint: "Text under avatar",
      group: "Content",
      defaultValue: null,
    },
  },
};
