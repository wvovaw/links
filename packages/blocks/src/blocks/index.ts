import type { BlockName, IBlock } from "../types";
import AvatarBlock from "./avatar";
import ButtonBlock from "./button";
import ParagraphBlock from "./paragraph";

export const blocksList = [
  { name: "Button" },
  { name: "Paragraph" },
  { name: "Avatar" },
] as const;

interface BlockModuleSchema {
  createBlock: (id: string) => IBlock;
  migrateBlock: (block: IBlock) => IBlock;
  BLOCK_VERSION: number;
};

const blocksModules = new Map<BlockName, BlockModuleSchema>();
blocksModules.set("Avatar", AvatarBlock);
blocksModules.set("Button", ButtonBlock);
blocksModules.set("Paragraph", ParagraphBlock);

function getBlockModule(name: BlockName): BlockModuleSchema {
  const module = blocksModules.get(name);
  if (!module)
    throw new Error(`Unknown block name: "${name}"`);

  return module;
}

/**
 * Creates a new block
 */
export function createBlock(name: BlockName, id: string): IBlock {
  const module = getBlockModule(name);
  return module.createBlock(id);
}

/**
 * Modifies the block using specific migration logic to make the block structure up to date with the current implementation.
 */
export function migrateBlock(block: IBlock): IBlock {
  const module = getBlockModule(block.name);
  return module.migrateBlock(block);
}

type CheckBlockVersion =
  | { blockId: string; blockName: BlockName; upToDate: true }
  | { blockId: string; blockName: BlockName; upToDate: false; lastVersion: number; currentVersion: number };

/**
 * Helper function to check if the block is up to date. It can be used to find out if the block needs to be updated
 */
export function checkBlockUpToDate(block: IBlock): CheckBlockVersion {
  const module = getBlockModule(block.name);

  if (block.version === module.BLOCK_VERSION) {
    return {
      blockId: block.id,
      blockName: block.name,
      upToDate: true,
    };
  }
  else {
    return {
      blockId: block.id,
      blockName: block.name,
      upToDate: false,
      currentVersion: block.version,
      lastVersion: module.BLOCK_VERSION,
    };
  }
}
