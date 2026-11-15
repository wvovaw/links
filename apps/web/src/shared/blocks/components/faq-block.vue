<script setup lang="ts">
import type {
  BlockProperty,
  IBlockPropertyBoolean,
  IBlockPropertyList,
  IBlockPropertySelect,
  IBlockPropertyText,
} from "@links/blocks";

import { completeRows } from "@links/blocks";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

type FaqRow = { question: string; answer: string };

const DIVIDER_STYLES = ["line", "filled", "none"] as const;
type DividerStyle = (typeof DIVIDER_STYLES)[number];

/** The style comes from stored data: anything outside the closed set draws the default line. */
function dividerStyle(value: string | undefined): DividerStyle {
  return DIVIDER_STYLES.find((style) => style === value) ?? "line";
}

/**
 * `<details name>` is what makes the answers one accordion the browser keeps single-open. The name has
 * to be unique per block — two FAQs on one page would otherwise close each other's answers — and the
 * same in the server render as in the browser, which is what `useId` gives.
 */
const groupName = `faq-${useId()}`;

const bp = computed(() => {
  const p = props.properties;

  return {
    title: (p.title as IBlockPropertyText | undefined)?.value?.trim(),
    /* A row holding half a question is not an answer yet, so it is not painted. */
    rows: completeRows(p.items as IBlockPropertyList | undefined, ["question", "answer"]) as FaqRow[],
    divider: dividerStyle((p["divider-style"] as IBlockPropertySelect | undefined)?.value),
    /*
      Off by default: the answers behave as one accordion. On, every `<details>` stands alone, because a
      group name is the only thing that ties them together.
    */
    group: (p["allow-multiple"] as IBlockPropertyBoolean | undefined)?.value ? undefined : groupName,
  };
});
</script>

<template>
  <div class="faq-block" :class="`faq-block--${bp.divider}`">
    <h2 v-if="bp.title" class="faq-block__title">{{ bp.title }}</h2>
    <details v-for="(row, index) of bp.rows" :key="index" class="faq-block__item" :name="bp.group">
      <summary class="faq-block__question">{{ row.question }}</summary>
      <p class="faq-block__answer">{{ row.answer }}</p>
    </details>
  </div>
</template>

<style>
/*
  A block with nothing to draw still measures one line, so the constructor keeps a box to select; the
  public page shows the same empty box, which is invisible.
*/
.faq-block {
  width: 100%;
  min-height: 2rem;
  color: var(--links-page-fg);
}
.faq-block__title {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  text-align: center;
  overflow-wrap: anywhere;
}
.faq-block__question {
  cursor: pointer;
  padding-block: 0.6rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.faq-block__answer {
  margin: 0;
  padding-block-end: 0.75rem;
  overflow-wrap: anywhere;
  /* An answer typed over several lines keeps those lines on the page. */
  white-space: pre-line;
}
.faq-block--line .faq-block__item {
  border-block-end: 1px solid color-mix(in srgb, var(--links-page-fg) 20%, transparent);
}
.faq-block--line .faq-block__item:last-of-type {
  border-block-end: 0;
}
.faq-block--filled .faq-block__item {
  border-radius: var(--links-page-radius, 10px);
  padding-inline: 0.75rem;
  background: color-mix(in srgb, var(--links-page-fg) 8%, transparent);
}
.faq-block--filled .faq-block__item + .faq-block__item {
  margin-block-start: 0.5rem;
}
</style>
