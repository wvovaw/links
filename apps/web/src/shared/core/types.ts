import type { blocksList } from "./blocks";

export type BlockName = typeof blocksList[number]["name"];

export type BlockPropertyType = "text" | "number" | "boolean" | "select" | "color" | "url";

export interface IBlockPropertyCommon<T = any> {
  id: number;
  type: BlockPropertyType;
  label: string;
  hint?: string;
  value?: T;
  defaultValue?: T;
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
export type BlockProperty =
  | IBlockPropertyText
  | IBlockPropertyNumber
  | IBlockPropertyBoolean
  | IBlockPropertySelect
  | IBlockPropertyUrl
  | IBlockPropertyColor;

export interface IBlock {
  id: string;
  name: BlockName;
  properties?: Record<string, BlockProperty>;
}

export interface IPage {
  id: string;
  title: string;
  blocks: IBlock[];
}
