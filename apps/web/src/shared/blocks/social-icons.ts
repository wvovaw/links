/** One slot of the block: the property it reads, the icon it draws and how a stored value becomes a link. */
export interface SocialSlot {
  readonly key: string;
  readonly label: string;
  readonly icon: string;
  readonly hrefPrefix: string;
  /** The only schemes a stored value may name; a value without a scheme takes `hrefPrefix`. */
  readonly schemes: readonly string[];
}

const WEB_SCHEMES = ["http:", "https:"] as const;

/**
 * The eight social slots, in the order they render. A slot is a fixed property rather than a row of a
 * repeatable list, which the block schema has no type for yet; an empty slot is hidden, so the owner
 * fills only the networks they use.
 */
export const SOCIAL_SLOTS: readonly SocialSlot[] = [
  { key: "telegram", label: "Telegram", icon: "i-simple-icons:telegram", hrefPrefix: "https://", schemes: WEB_SCHEMES },
  {
    key: "instagram",
    label: "Instagram",
    icon: "i-simple-icons:instagram",
    hrefPrefix: "https://",
    schemes: WEB_SCHEMES,
  },
  { key: "youtube", label: "YouTube", icon: "i-simple-icons:youtube", hrefPrefix: "https://", schemes: WEB_SCHEMES },
  { key: "tiktok", label: "TikTok", icon: "i-simple-icons:tiktok", hrefPrefix: "https://", schemes: WEB_SCHEMES },
  { key: "x", label: "X", icon: "i-simple-icons:x", hrefPrefix: "https://", schemes: WEB_SCHEMES },
  { key: "vk", label: "VK", icon: "i-simple-icons:vk", hrefPrefix: "https://", schemes: WEB_SCHEMES },
  { key: "whatsapp", label: "WhatsApp", icon: "i-simple-icons:whatsapp", hrefPrefix: "https://", schemes: WEB_SCHEMES },
  { key: "email", label: "Email", icon: "i-lucide:mail", hrefPrefix: "mailto:", schemes: ["mailto:"] },
];

/* The scheme of a value that names one: `t.me/me` has none, `mailto:` has one. */
const SCHEME = /^([a-z][\w+.-]*):/i;

/**
 * The address a slot draws, or `null` for a slot the owner left empty or filled with something the page
 * must not link to. The field is free text, the API stores block JSON unvalidated and the public page
 * has no CSP, so a stored `javascript:` value in `href` would execute in the app's own origin when a
 * visitor clicks it: only `http`/`https` pass for a network slot and only `mailto:` for the email slot.
 * A value without a scheme takes the slot's own — `t.me/me` becomes a url and `me@example.com` becomes
 * a mail link. Total on every input because it runs while a public page renders.
 */
export function socialHref(slot: { hrefPrefix: string; schemes: readonly string[] }, value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  /* `//evil.example` is a protocol-relative url: prefixing it would only dress it up as one of ours. */
  if (trimmed.startsWith("//")) return null;

  const scheme = SCHEME.exec(trimmed)?.[1]?.toLowerCase();
  if (!scheme) return `${slot.hrefPrefix}${trimmed}`;

  return slot.schemes.includes(`${scheme}:`) ? trimmed : null;
}
