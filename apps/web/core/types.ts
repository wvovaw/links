import type { blocksList } from "./block";

export type BlockPropertyType = "string" | "text" | "number" | "checkbox" | "switch" | "select" | "color" | "url";

export type BlockName = typeof blocksList[number]["name"];

export interface IBlockProperty<T = any> {
  type: BlockPropertyType;
  label: string;
  value?: T;
  defaultValue?: T;
  required?: boolean;
  group?: string;
}


export interface IBlock {
  id: string;
  name: BlockName;
  properties?: Record<string, IBlockProperty>;
}

export interface IPage {
  id: string;
  title: string;
  blocks: IBlock[];
}
