<script setup lang="ts">
import type { StatsTotals } from "~shared/api/backend";

import { UICard } from "@links/ui";

import { countDelta, type MetricDelta, pointsDelta } from "../model/delta";

const props = defineProps<{
  totals: StatsTotals;
  /** The same window immediately before this one; absent or `null` when the range has no bounds. */
  previous?: StatsTotals | null;
  /** The overview shows CTR too: its rate is clicks ÷ views across the pages, not an average of rates. */
  showCtr?: boolean;
}>();

const { t } = useI18n();

const ARROWS: Record<MetricDelta["direction"], string> = { up: "↑", down: "↓", flat: "→" };

const TONES: Record<MetricDelta["direction"], string> = {
  up: "text-roshi",
  down: "text-dodoria",
  flat: "text-trunks",
};

/** With no visits there is no rate: a dash on the card, and a zero rate that pointsDelta refuses as a baseline. */
function rateOf(totals: StatsTotals): number {
  return totals.views ? totals.clicks / totals.views : 0;
}

const metrics = computed(() => {
  const previous = props.previous ?? null;
  const rate = rateOf(props.totals);

  return [
    {
      id: "views",
      label: t("stats.totals.views"),
      icon: "i-lucide:eye",
      value: String(props.totals.views),
      delta: previous ? countDelta(props.totals.views, previous.views) : null,
    },
    {
      id: "visitors",
      label: t("stats.totals.visitors"),
      icon: "i-lucide:users",
      value: String(props.totals.visitors),
      delta: previous ? countDelta(props.totals.visitors, previous.visitors) : null,
    },
    {
      id: "clicks",
      label: t("stats.totals.clicks"),
      icon: "i-lucide:mouse-pointer-click",
      value: String(props.totals.clicks),
      delta: previous ? countDelta(props.totals.clicks, previous.clicks) : null,
    },
    ...(props.showCtr
      ? [
          {
            id: "ctr",
            label: t("stats.totals.ctr"),
            icon: "i-lucide:percent",
            value: props.totals.views ? `${Math.round(rate * 100)}%` : "—",
            delta: previous ? pointsDelta(rate, rateOf(previous)) : null,
          },
        ]
      : []),
  ];
});
</script>

<template>
  <dl class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
    <UICard.Root
      v-for="metric of metrics"
      :key="metric.id"
      :data-metric="metric.id"
      class="rounded-moon-s-md bg-gohan shadow-moon-sm"
    >
      <!-- `pt-6`: a headerless body drops its top padding, and the stat card wants the frame on all four sides. -->
      <UICard.Body class="flex items-start gap-3 pt-6">
        <span
          :class="metric.icon"
          class="flex size-10 shrink-0 items-center justify-center rounded-full bg-jiren text-moon-20 text-piccolo"
          aria-hidden="true"
        />
        <div class="flex flex-col gap-1">
          <dt class="text-moon-12 text-trunks">{{ metric.label }}</dt>
          <dd class="flex flex-col gap-1">
            <span class="text-moon-24 font-semibold">{{ metric.value }}</span>
            <span
              v-if="metric.delta"
              data-delta
              class="self-start text-moon-12 font-medium"
              :class="TONES[metric.delta.direction]"
              :title="t('stats.totals.previous')"
            >
              {{ ARROWS[metric.delta.direction] }} {{ `${metric.delta.value > 0 ? "+" : ""}${metric.delta.value}%` }}
            </span>
          </dd>
        </div>
      </UICard.Body>
    </UICard.Root>
  </dl>
</template>
