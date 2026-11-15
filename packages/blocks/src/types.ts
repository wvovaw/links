export const BLOCK_NAMES = [
  "Avatar",
  "Button",
  "Divider",
  "Heading",
  "Map",
  "Music",
  "Paragraph",
  "Picture",
  "SocialIcons",
  "Spacer",
  "Video",
] as const;
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
  "i-lucide:minus",
  "i-lucide:heading",
  "i-lucide:map",
  "i-lucide:music",
  "i-lucide:align-left",
  "i-lucide:image",
  "i-lucide:move-vertical",
  "i-lucide:share-2",
  "i-lucide:video",
];

/**
 * The icons a link card may show. A subset of `BLOCK_ICONS`, because the two lists answer different
 * questions: `BLOCK_ICONS` is what the palette needs drawn, while this is what reads as a decoration
 * on a link — a structural icon such as `minus` has no business in every button's icon picker.
 */
export const LINK_ICONS: readonly string[] = [
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
  Divider: {
    label: "Divider",
    description: "A line or a gap that separates two blocks.",
    icon: "i-lucide:minus",
    category: "Layout",
    keywords: ["separator", "line", "rule"],
  },
  Heading: {
    label: "Heading",
    description: "A title that starts a section of the page.",
    icon: "i-lucide:heading",
    category: "Content",
    keywords: ["title", "section", "h1", "h2", "h3"],
  },
  Map: {
    label: "Map",
    description: "A map of an address or a place, opened in place.",
    icon: "i-lucide:map",
    category: "Media",
    keywords: ["map", "location", "address", "google maps", "place"],
  },
  Music: {
    label: "Music",
    description: "A track, an album or a playlist from Spotify, SoundCloud, Apple Music or YouTube Music.",
    icon: "i-lucide:music",
    category: "Media",
    keywords: ["spotify", "soundcloud", "apple music", "youtube music", "track", "album", "playlist", "embed"],
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
  SocialIcons: {
    label: "Social icons",
    description: "A row of icons linking to your social profiles and an email address.",
    icon: "i-lucide:share-2",
    category: "Social",
    keywords: ["social", "telegram", "instagram", "youtube", "tiktok", "x", "vk", "whatsapp", "email", "contacts"],
  },
  Spacer: {
    label: "Spacer",
    description: "Empty space between two blocks.",
    icon: "i-lucide:move-vertical",
    category: "Layout",
    keywords: ["gap", "space", "margin"],
  },
  Video: {
    label: "Video",
    description: "A video from YouTube, Vimeo or TikTok, played in place.",
    icon: "i-lucide:video",
    category: "Media",
    keywords: ["youtube", "vimeo", "tiktok", "clip", "embed"],
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
