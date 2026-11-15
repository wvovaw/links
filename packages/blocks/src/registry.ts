import type { BlockModuleSchema, BlockName, IBlock } from "./types";

import AvatarModule from "./blocks/avatar";
import ButtonModule from "./blocks/button";
import DividerModule from "./blocks/divider";
import HeadingModule from "./blocks/heading";
import MusicModule from "./blocks/music";
import ParagraphModule from "./blocks/paragraph";
import PictureModule from "./blocks/picture";
import SocialIconsModule from "./blocks/social-icons";
import SpacerModule from "./blocks/spacer";
import VideoModule from "./blocks/video";

type Registry = {
  readonly [K in BlockName]: BlockModuleSchema;
};

export const registry: Registry = {
  Avatar: AvatarModule,
  Button: ButtonModule,
  Divider: DividerModule,
  Heading: HeadingModule,
  Music: MusicModule,
  Paragraph: ParagraphModule,
  Picture: PictureModule,
  SocialIcons: SocialIconsModule,
  Spacer: SpacerModule,
  Video: VideoModule,
};

export function getBlockModule(name: BlockName): Registry[BlockName] {
  const module = registry[name];
  if (!module) throw new Error(`Unknown block name: "${name}"`);
  return module;
}

export function createBlock<K extends BlockName>(name: K, id: string): IBlock<K> {
  return registry[name].createBlock(id) as IBlock<K>;
}
