<script setup lang="ts">
import type {
  BlockProperty,
  IBlockPropertyBoolean,
  IBlockPropertyColor,
  IBlockPropertyImage,
  IBlockPropertyNumber,
  IBlockPropertySelect,
  IBlockPropertyText,
  IBlockPropertyUrl,
} from "@links/blocks";

import { resolveBlockImageUrl } from "~shared/blocks";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const config = useRuntimeConfig();

const CARD_VARIANTS = ["solid", "outline", "ghost"] as const;
type CardVariant = (typeof CARD_VARIANTS)[number];

/**
 * `Page default` stores no variant, and a button stored before the property existed has none
 * either: both keep every token the page theme sets, which is how the button always rendered.
 */
function cardVariant(value: string | undefined): CardVariant | null {
  return CARD_VARIANTS.find((variant) => variant === value) ?? null;
}

/**
 * The tokens an explicit block variant replaces. `solid` fills with the accent exactly as the page
 * theme fills its own solid button (a page themed `outline` would otherwise leave this one
 * transparent); `outline` and `ghost` take their colour from the accent so they read on any page.
 */
function variantTokens(
  variant: CardVariant | null,
  own: { background?: string; foreground?: string; border?: string },
): Record<string, string> {
  switch (variant) {
    case "solid":
      return {
        "--button-bg": own.background || "var(--links-page-accent)",
        "--button-fg": own.foreground || "#fff",
        "--button-border": "transparent",
        "--button-border-width": "0",
      };
    case "outline":
      return {
        "--button-bg": "transparent",
        "--button-fg": own.foreground || "var(--links-page-accent)",
        "--button-border": own.border || "var(--links-page-accent)",
        "--button-border-width": "1px",
      };
    case "ghost":
      return {
        "--button-bg": "transparent",
        "--button-fg": own.foreground || "var(--links-page-accent)",
        "--button-border": "transparent",
        "--button-border-width": "0",
      };
    default:
      return {};
  }
}

const bp = computed(() => {
  const p = props.properties;
  const foreground = (p.foreground as IBlockPropertyColor | undefined)?.value;
  const background = (p.background as IBlockPropertyColor | undefined)?.value;
  const fontSize = (p["font-size"] as IBlockPropertySelect | undefined)?.value;
  const border = (p.border as IBlockPropertyColor | undefined)?.value;
  const height = (p.height as IBlockPropertyNumber | undefined)?.value;
  const radius = (p.radius as IBlockPropertyNumber | undefined)?.value;
  const subtitle = (p.subtitle as IBlockPropertyText | undefined)?.value;
  const variant = cardVariant((p.variant as IBlockPropertySelect | undefined)?.value);

  return {
    text: (p.text! as IBlockPropertyText).value,
    link: p.link!.value ? (p.link as IBlockPropertyUrl).value : "#",
    /* Buttons stored before the switch existed always opened in a new tab. */
    newTab: (p["new-tab"] as IBlockPropertyBoolean | undefined)?.value ?? true,
    thumbnail:
      resolveBlockImageUrl((p.thumbnail as IBlockPropertyImage | undefined)?.value, {
        origin: config.public.backendUrl,
      }) ?? "",
    subtitle,
    icon: (p.icon as IBlockPropertySelect | undefined)?.value ?? "",
    /* Only a thumbnail or a subtitle turns the link into a text column worth aligning to the start. */
    card: Boolean(subtitle || (p.thumbnail as IBlockPropertyImage | undefined)?.value),
    style: {
      "--button-fg": foreground || "var(--links-theme-button-fg)",
      "--button-bg": background || "var(--links-theme-button-bg)",
      "--button-font-size": fontSize || "var(--links-theme-button-font-size-md)",
      "--button-border": border || "var(--links-theme-button-border, #eee)",
      "--button-height": `${height ?? 56}px`,
      "--button-radius": `${radius ?? 8}px`,
      ...variantTokens(variant, { background, foreground, border }),
    },
  };
});
</script>

<template>
  <a
    :href="bp.link"
    :target="bp.newTab ? '_blank' : undefined"
    :rel="bp.newTab ? 'noopener noreferrer' : undefined"
    class="button-block"
    :class="{ 'button-block--card': bp.card }"
    :style="bp.style"
  >
    <img v-if="bp.thumbnail" class="button-block__thumbnail" :src="bp.thumbnail" alt="" loading="lazy" />
    <span class="button-block__body">
      <span class="button-block__text">
        <template v-if="bp.text">
          {{ bp.text }}
        </template>
        <template v-else> &ThinSpace; </template>
      </span>
      <span v-if="bp.subtitle" class="button-block__subtitle">{{ bp.subtitle }}</span>
    </span>
    <span v-if="bp.icon" class="button-block__icon" :class="bp.icon" aria-hidden="true" />
  </a>
</template>

<style>
.button-block {
  color: var(--button-fg, var(--links-theme-button-fg));
  background: var(--button-bg, var(--links-theme-button-bg));
  font-size: var(--button-font-size, var(--links-theme-button-font-size-md));
  border-color: var(--button-border, #eee);
  /* Preflight zeroes every border, so the theme's outline needs its width back. */
  border-width: var(--button-border-width, var(--links-theme-button-border-width, 0));
  font-weight: 600;
  width: 100%;
  height: var(--button-height, 3.5rem);
  border-radius: var(--button-radius, 0.5rem);
  padding-inline: 1rem;
  gap: 0.75rem;
  display: flex;
  place-items: center;
  text-align: center;
  user-select: none;
  overflow: hidden;
}
.button-block__body {
  /* `min-width: 0` lets the text column shrink inside the row, which is what keeps the ellipsis. */
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.button-block--card .button-block__body {
  text-align: start;
}
.button-block__text,
.button-block__subtitle {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
.button-block__subtitle {
  font-size: 0.8em;
  font-weight: 400;
  opacity: 0.8;
}
.button-block__thumbnail {
  flex: 0 0 auto;
  align-self: stretch;
  width: auto;
  aspect-ratio: 1;
  max-width: 40%;
  object-fit: cover;
  border-radius: calc(var(--button-radius, 0.5rem) / 2);
}
.button-block__icon {
  flex: 0 0 auto;
  font-size: 1.25em;
}
</style>
