export interface ShareChannel {
  id: string;
  /** Filled into `utm_source` when the channel is picked; empty for the custom one. */
  source: string;
  /** `utm_medium`: one of the values the source table classifies, never a free word. */
  medium: string;
  icon: string;
}

/**
 * The channels an owner actually posts in. Every medium here is one the backend knows, so picking
 * "Telegram" and reading "telegram · social" in the dashboard is the same decision made once. The custom
 * entry is deliberately empty: it exists to be typed into, and its highlight therefore never matches.
 */
export const shareChannels: ShareChannel[] = [
  { id: "telegram", source: "telegram", medium: "social", icon: "i-simple-icons:telegram" },
  { id: "instagram", source: "instagram", medium: "social", icon: "i-simple-icons:instagram" },
  { id: "vk", source: "vk", medium: "social", icon: "i-simple-icons:vk" },
  { id: "newsletter", source: "newsletter", medium: "email", icon: "i-lucide:mail" },
  { id: "partner", source: "partner", medium: "referral", icon: "i-lucide:handshake" },
  { id: "custom", source: "", medium: "", icon: "i-lucide:pencil" },
];
