export const BLOCK_NAMES = ["Avatar", "Button", "Paragraph", "Picture"] as const;
export type BlockName = (typeof BLOCK_NAMES)[number];

export const BLOCK_CATEGORIES = ["Content", "Media", "Links", "Social", "Commerce", "Layout"] as const;
export type BlockCategory = (typeof BLOCK_CATEGORIES)[number];

export interface BlockMeta {
  readonly name: BlockName;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly category: BlockCategory;
  readonly keywords: readonly string[];
}

/**
 * Every icon referenced by `BLOCK_META` must be listed here: UnoCSS generates icon classes at build
 * time, so an icon missing from the web app's safelist renders as an empty box without any error.
 */
export const BLOCK_ICONS: readonly string[] = [
  "i-lucide:circle-user-round",
  "i-lucide:link",
  "i-lucide:align-left",
  "i-lucide:image",
];

/** English fallbacks: the i18n layer overrides them through `blocks.<Name>.label` / `.description`. */
export const BLOCK_META: Record<BlockName, Omit<BlockMeta, "name">> = {
  Avatar: {
    label: "Avatar",
    description: "A round profile photo with a short caption.",
    icon: "i-lucide:circle-user-round",
    category: "Content",
    keywords: ["profile", "photo", "user"],
  },
  Button: {
    label: "Button",
    description: "A large clickable link to another page or site.",
    icon: "i-lucide:link",
    category: "Links",
    keywords: ["link", "cta", "action"],
  },
  Paragraph: {
    label: "Paragraph",
    description: "A block of text for a bio, an address or a note.",
    icon: "i-lucide:align-left",
    category: "Content",
    keywords: ["text", "copy", "about"],
  },
  Picture: {
    label: "Picture",
    description: "A single image with an optional caption.",
    icon: "i-lucide:image",
    category: "Media",
    keywords: ["image", "photo", "gallery"],
  },
};

export const blocksList: readonly BlockMeta[] = BLOCK_NAMES.map((name) => ({ name, ...BLOCK_META[name] }));

export type BlockPropertyType = "text" | "number" | "boolean" | "select" | "color" | "url" | "image";

export interface IBlockPropertyCommon<T = unknown> {
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
