import type { IBlock } from "../../src/types";

/**
 * A stored Picture as written before the version 1 migration: a lone uploaded image, with no `alt`,
 * no `loading`, no `object-fit`, no link and no radius.
 */
export const pictureV0: IBlock<"Picture"> = {
  id: "picture-v0",
  version: 0,
  name: "Picture",
  properties: {
    image: {
      id: 0,
      type: "image",
      label: "Image",
      group: "Content",
      defaultValue: null,
    },
  },
};
