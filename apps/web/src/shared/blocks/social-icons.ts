/** One slot of the block: the property it reads, the icon it draws and how a stored value becomes a link. */
export interface SocialSlot {
  readonly key: string;
  readonly label: string;
  readonly icon: string;
  readonly hrefPrefix: string;
}

/**
 * The eight social slots, in the order they render. A slot is a fixed property rather than a row of a
 * repeatable list, which the block schema has no type for yet; an empty slot is hidden, so the owner
 * fills only the networks they use.
 */
export const SOCIAL_SLOTS: readonly SocialSlot[] = [
  { key: "telegram", label: "Telegram", icon: "i-simple-icons:telegram", hrefPrefix: "https://" },
  { key: "instagram", label: "Instagram", icon: "i-simple-icons:instagram", hrefPrefix: "https://" },
  { key: "youtube", label: "YouTube", icon: "i-simple-icons:youtube", hrefPrefix: "https://" },
  { key: "tiktok", label: "TikTok", icon: "i-simple-icons:tiktok", hrefPrefix: "https://" },
  { key: "x", label: "X", icon: "i-simple-icons:x", hrefPrefix: "https://" },
  { key: "vk", label: "VK", icon: "i-simple-icons:vk", hrefPrefix: "https://" },
  { key: "whatsapp", label: "WhatsApp", icon: "i-simple-icons:whatsapp", hrefPrefix: "https://" },
  { key: "email", label: "Email", icon: "i-lucide:mail", hrefPrefix: "mailto:" },
];

/* A value that already names its scheme is kept as typed; `t.me/me` is not a scheme, `mailto:` is. */
const HAS_SCHEME = /^[a-z][\w+.-]*:/i;

/**
 * The address a slot draws, or `null` for a slot the owner left empty. A network slot takes a profile
 * link and the email slot takes a bare address, so a value without a scheme is prefixed with the slot's
 * own — `t.me/me` becomes a url and `me@example.com` becomes a mail link. Total on every input because
 * it runs while a public page renders.
 */
export function socialHref(slot: { hrefPrefix: string }, value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  return HAS_SCHEME.test(trimmed) ? trimmed : `${slot.hrefPrefix}${trimmed}`;
}
