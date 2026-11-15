<script setup lang="ts">
import type {
  BlockProperty,
  IBlockPropertyBoolean,
  IBlockPropertyDate,
  IBlockPropertySelect,
  IBlockPropertyText,
} from "@links/blocks";

import { countdownParts, formatCountdown } from "~shared/blocks/countdown";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const VARIANTS = ["box", "plain"] as const;
type CountdownVariant = (typeof VARIANTS)[number];

/** The stored value comes from a page, so it is matched against its closed set rather than trusted. */
function countdownVariant(value: string | undefined): CountdownVariant {
  return VARIANTS.find((variant) => variant === value) ?? "box";
}

const DEFAULT_FINISHED_TEXT = "The countdown has finished";
const pad = (value: number) => String(value).padStart(2, "0");

/**
 * The first render must be identical on the server and in the browser, and a countdown is nothing but
 * the difference between two clocks: the server's instant and the visitor's differ by the whole trip
 * between them, so starting the ref at `new Date()` would hydrate one second and warn about the next.
 * It starts empty instead and the block draws nothing until `onMounted` starts the clock.
 */
const now = ref<Date | null>(null);
let ticker: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  now.value = new Date();
  ticker = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onBeforeUnmount(() => {
  if (ticker) clearInterval(ticker);
});

const bp = computed(() => {
  const p = props.properties;
  const target = (p.target as IBlockPropertyDate | undefined)?.value ?? "";
  /*
    Only an empty target draws nothing: a countdown nobody has pointed at a date has nothing to show.
    A target the parser cannot read is a different case — `countdownParts` calls it finished — so it
    falls through to the finished text like any target that has already passed.
  */
  const parts = now.value && target !== "" ? countdownParts(target, now.value) : null;
  const finished = parts?.finished ?? false;
  const hideAfterFinish = (p["hide-after-finish"] as IBlockPropertyBoolean | undefined)?.value ?? false;

  return {
    /* The clock has not started, or a `hide-after-finish` countdown has run out: no block at all. */
    show: parts !== null && !(finished && hideAfterFinish),
    variant: countdownVariant((p.variant as IBlockPropertySelect | undefined)?.value),
    title: (p.title as IBlockPropertyText | undefined)?.value?.trim() || null,
    finished,
    finishedText: (p["finished-text"] as IBlockPropertyText | undefined)?.value?.trim() || DEFAULT_FINISHED_TEXT,
    label: parts && !finished ? formatCountdown(parts) : undefined,
    /* Always four parts: the grid keeps its shape whatever the target is, days included at zero. */
    units:
      parts && !finished
        ? [
            { key: "days", value: pad(parts.days), label: "d" },
            { key: "hours", value: pad(parts.hours), label: "h" },
            { key: "minutes", value: pad(parts.minutes), label: "m" },
            { key: "seconds", value: pad(parts.seconds), label: "s" },
          ]
        : [],
  };
});
</script>

<template>
  <div v-if="bp.show" class="countdown-block" :class="`countdown-block--${bp.variant}`">
    <p v-if="bp.title" class="countdown-block__title">{{ bp.title }}</p>
    <p v-if="bp.finished" class="countdown-block__finished">{{ bp.finishedText }}</p>
    <div v-else class="countdown-block__parts" role="timer" :aria-label="bp.label">
      <span v-for="unit in bp.units" :key="unit.key" class="countdown-block__unit">
        <span class="countdown-block__value">{{ unit.value }}</span>
        <span class="countdown-block__unit-label">{{ unit.label }}</span>
      </span>
    </div>
  </div>
</template>

<style>
.countdown-block {
  width: 100%;
  color: var(--links-page-fg);
  text-align: center;
}
.countdown-block__title {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
}
.countdown-block__parts {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
.countdown-block__unit {
  display: flex;
  flex-direction: column;
  min-width: 3.5rem;
  padding: 0.4rem 0.25rem;
}
/* The border stays on the box style only: a plain countdown is the page's own text and nothing else. */
.countdown-block--box .countdown-block__unit {
  border: 1px solid var(--links-page-accent);
  border-radius: var(--links-page-radius);
}
.countdown-block__value {
  font-size: 1.4rem;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  line-height: 1.2;
}
.countdown-block__unit-label {
  color: var(--links-page-accent);
  font-size: 0.7rem;
  text-transform: uppercase;
}
.countdown-block__finished {
  margin: 0;
  font-size: 0.95rem;
}
</style>
