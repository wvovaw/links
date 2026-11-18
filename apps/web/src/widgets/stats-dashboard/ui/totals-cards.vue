<script setup lang="ts">
import type { StatsPoint, StatsTotals } from "~shared/api/backend";

import { UICard } from "@links/ui";

import { countDelta, type MetricDelta, pointsDelta } from "../model/delta";
import type { StatsRangePreset } from "../model/fill-days";
import { metricSpark, type SparkMetric } from "../model/spark";
import SparkLine from "./spark-line.vue";

const props = defineProps<{
  totals: StatsTotals;
  /** The same window immediately before this one; absent or `null` when the range has no bounds. */
  previous?: StatsTotals | null;
  /** The overview shows CTR too: its rate is clicks ÷ views across the pages, not an average of rates. */
  showCtr?: boolean;
  /**
   * The range's series and the window it was asked with — both or neither, because a sparkline fills the
   * range's quiet days and the window is what tells it which days those are. Omitted, the cards carry
   * numbers alone.
   */
  series?: { points: StatsPoint[]; preset: StatsRangePreset; now: Date };
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
      id: "clicks",
      spark: "clicks" as SparkMetric,
      label: t("stats.totals.clicks"),
      icon: "i-lucide:mouse-pointer-click",
      value: String(props.totals.clicks),
      delta: previous ? countDelta(props.totals.clicks, previous.clicks) : null,
    },
    {
      id: "visitors",
      spark: "visitors" as SparkMetric,
      label: t("stats.totals.visitors"),
      icon: "i-lucide:users",
      value: String(props.totals.visitors),
      delta: previous ? countDelta(props.totals.visitors, previous.visitors) : null,
    },
    ...(props.showCtr
      ? [
          {
            id: "ctr",
            spark: "ctr" as SparkMetric,
            label: t("stats.totals.ctr"),
            icon: "i-lucide:percent",
            value: props.totals.views ? `${Math.round(rate * 100)}%` : "—",
            delta: previous ? pointsDelta(rate, rateOf(previous)) : null,
          },
        ]
      : []),
    {
      id: "views",
      spark: "views" as SparkMetric,
      label: t("stats.totals.views"),
      icon: "i-lucide:eye",
      value: String(props.totals.views),
      delta: previous ? countDelta(props.totals.views, previous.views) : null,
    },
  ];
});

/** The card's own line: the days of the range, so a quiet week reads as the flat line it was. */
function sparkOf(metric: SparkMetric): number[] {
  const { series } = props;

  return series ? metricSpark(series.points, metric, series.preset, series.now) : [];
}
</script>

<template>
  <dl class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
    <UICard.Root
      v-for="metric of metrics"
      :key="metric.id"
      :data-metric="metric.id"
      class="min-w-0 rounded-moon-s-md bg-gohan shadow-moon-sm"
    >
      <!-- `pt-6`: a headerless body drops its top padding, and the stat card wants the frame on all four sides. -->
      <UICard.Body class="flex min-w-0 items-start gap-3 pt-6">
        <span
          :class="metric.icon"
          class="flex size-10 shrink-0 items-center justify-center rounded-full bg-jiren text-moon-20 text-piccolo"
          aria-hidden="true"
        />
        <div class="flex min-w-0 flex-col gap-1">
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
        <!-- A phone's two-column card has no room for the line; the number is what it must keep. -->
        <SparkLine
          v-if="series"
          class="ms-auto hidden shrink-0 self-center text-piccolo sm:block"
          :values="sparkOf(metric.spark)"
        />
      </UICard.Body>
    </UICard.Root>
  </dl>
</template>
