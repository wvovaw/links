export const BLOCK_NAMES = ["Avatar", "Button", "Paragraph", "Picture"] as const;
export type BlockName = (typeof BLOCK_NAMES)[number];

export const blocksList = BLOCK_NAMES.map((name) => ({ name }));

export type BlockPropertyType = "text" | "number" | "boolean" | "select" | "color" | "url" | "image";

export interface IBlockPropertyCommon<T = any> {
  id: number;
  type: BlockPropertyType;
  label: string;
  hint?: string;
  value?: T;
  defaultValue: T | null;
  required?: boolean;
  group?: string;
}
export interface IBlockPropertyText<T = string> extends IBlockPropertyCommon<T> {
  type: "text";
  maxLength?: number;
  minLength?: number;
  multiline?: boolean;
}
export interface IBlockPropertyBoolean<T = boolean> extends IBlockPropertyCommon<T> {
  type: "boolean";
  variant: "switch" | "checkbox";
}
export interface IBlockPropertyNumber<T = number> extends IBlockPropertyCommon<T> {
  type: "number";
  min: number;
  max: number;
  step: number;
}
export interface IBlockPropertyUrl<T = string> extends IBlockPropertyCommon<T> {
  type: "url";
}
export interface IBlockPropertyColor extends IBlockPropertyCommon<string> {
  type: "color";
}
export interface IBlockPropertySelect<T = string> extends IBlockPropertyCommon<T> {
  type: "select";
  options: { value: T; label: string }[];
  isMultiple?: boolean;
}
export interface IBlockPropertyImage<T = string> extends IBlockPropertyCommon<T> {
  type: "image";
  accept?: string;
}
export type BlockProperty =
  | IBlockPropertyText
  | IBlockPropertyNumber
  | IBlockPropertyBoolean
  | IBlockPropertySelect
  | IBlockPropertyUrl
  | IBlockPropertyColor
  | IBlockPropertyImage;

export interface IBlock<K extends BlockName = BlockName> {
  id: string;
  name: K;
  properties: Record<string, BlockProperty>;
  version: number;
}

export interface BlockModuleSchema {
  readonly name: BlockName;
  readonly createBlock: (id: string) => IBlock;
  readonly migrateBlock: (block: IBlock) => IBlock;
  readonly BLOCK_VERSION: number;
}
