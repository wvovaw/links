<script setup lang="ts">
import type { BlockProperty, IBlockPropertyNumber, IBlockPropertySelect, IBlockPropertyUrl } from "@links/blocks";

import { clampNumber } from "~shared/blocks/clamp-number";
import { socialHref, SOCIAL_SLOTS } from "~shared/blocks/social-icons";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const SOCIAL_VARIANTS = ["filled", "outline", "plain"] as const;
type SocialVariant = (typeof SOCIAL_VARIANTS)[number];

const SOCIAL_ALIGNS = ["left", "center", "right"] as const;
type SocialAlign = (typeof SOCIAL_ALIGNS)[number];

/** Both come from stored data, so they are matched against their closed sets rather than trusted. */
function socialVariant(value: string | undefined): SocialVariant {
  return SOCIAL_VARIANTS.find((variant) => variant === value) ?? "filled";
}

function socialAlign(value: string | undefined): SocialAlign {
  return SOCIAL_ALIGNS.find((align) => align === value) ?? "center";
}

/**
 * A filled icon is the page accent with a light glyph, an outline takes its ring from the accent, and a
 * plain one is the page's own text colour with nothing around it. The border stays transparent rather
 * than absent so the three variants keep the same box and the same click target.
 */
const VARIANT_TOKENS: Record<SocialVariant, Record<string, string>> = {
  filled: {
    "--social-bg": "var(--links-page-accent)",
    "--social-fg": "#fff",
    "--social-border": "transparent",
  },
  outline: {
    "--social-bg": "transparent",
    "--social-fg": "var(--links-page-accent)",
    "--social-border": "var(--links-page-accent)",
  },
  plain: {
    "--social-bg": "transparent",
    "--social-fg": "var(--links-page-fg)",
    "--social-border": "transparent",
  },
};

const bp = computed(() => {
  const p = props.properties;

  /* A slot with no value draws nothing, so a page with every slot empty renders no block at all. */
  const links = SOCIAL_SLOTS.flatMap((slot) => {
    const href = socialHref(slot, (p[slot.key] as IBlockPropertyUrl | undefined)?.value);
    if (!href) return [];

    return [
      {
        key: slot.key,
        label: slot.label,
        icon: slot.icon,
        href,
        /* Only a web link leaves the page; a `mailto:` hands off to the mail client in place. */
        external: /^https?:/i.test(href),
      },
    ];
  });

  return {
    links,
    style: {
      "--social-size": `${clampNumber((p.size as IBlockPropertyNumber | undefined)?.value, 16, 48, 24)}px`,
      "--social-align": socialAlign((p.align as IBlockPropertySelect | undefined)?.value),
      ...VARIANT_TOKENS[socialVariant((p.variant as IBlockPropertySelect | undefined)?.value)],
    },
  };
});
</script>

<template>
  <div v-if="bp.links.length" class="social-icons-block" :style="bp.style">
    <a
      v-for="link of bp.links"
      :key="link.key"
      class="social-icons-block__link"
      :href="link.href"
      :target="link.external ? '_blank' : undefined"
      :rel="link.external ? 'noopener noreferrer' : undefined"
      :title="link.label"
      :aria-label="link.label"
    >
      <span class="social-icons-block__icon" :class="link.icon" />
    </a>
  </div>
</template>

<style>
.social-icons-block {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: var(--social-align, center);
  gap: 0.5rem;
  width: 100%;
}
.social-icons-block__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* The padding is a quarter of the icon, so the box and the click target grow with the icon. */
  padding: calc(var(--social-size, 24px) / 4);
  border: 1px solid var(--social-border, transparent);
  border-radius: 100%;
  background: var(--social-bg, transparent);
  color: var(--social-fg, var(--links-page-fg));
  text-decoration: none;
  line-height: 0;
}
/* An icon class is one em square, so the font size is what sets the icon's edge. */
.social-icons-block__icon {
  font-size: var(--social-size, 24px);
  line-height: 1;
}
</style>
