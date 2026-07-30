import type { BlockModuleSchema, BlockName, IBlock } from "./types";

import AvatarModule from "./blocks/avatar";
import ButtonModule from "./blocks/button";
import ParagraphModule from "./blocks/paragraph";
import PictureModule from "./blocks/picture";

type Registry = {
  readonly [K in BlockName]: BlockModuleSchema;
};

export const registry: Registry = {
  Avatar: AvatarModule,
  Button: ButtonModule,
  Paragraph: ParagraphModule,
  Picture: PictureModule,
};

export function getBlockModule(name: BlockName): Registry[BlockName] {
  const module = registry[name];
  if (!module) throw new Error(`Unknown block name: "${name}"`);
  return module;
}

export function createBlock<K extends BlockName>(name: K, id: string): IBlock<K> {
  return registry[name].createBlock(id) as IBlock<K>;
}
