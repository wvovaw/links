import type { BlockName, IBlock } from "./types";
import { getBlockModule } from "./registry";

type CheckBlockVersion =
  | { blockId: string; blockName: BlockName; upToDate: true }
  | { blockId: string; blockName: BlockName; upToDate: false; lastVersion: number; currentVersion: number };

export function migrateBlock(block: IBlock): IBlock {
  const module = getBlockModule(block.name);
  return module.migrateBlock(block);
}

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
