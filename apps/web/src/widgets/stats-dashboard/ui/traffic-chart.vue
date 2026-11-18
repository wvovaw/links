<script setup lang="ts">
import type { StatsPoint } from "~shared/api/backend";

import { UICard, UIToggleGroup, UIToggleGroupItem } from "@links/ui";

import type { ChartMetric, StatsRangePreset } from "../model";

import SeriesChart from "./series-chart.vue";

defineProps<{
  points: StatsPoint[];
  preset: StatsRangePreset;
  /** The clock the axis is drawn from, passed in so a test — and the screen beside it — use one instant. */
  now: Date;
}>();

const { t } = useI18n();

const metrics: ChartMetric[] = ["views", "visitors", "clicks"];
const metric = ref<ChartMetric>("views");
</script>

<template>
  <UICard.Root class="rounded-moon-s-md bg-gohan shadow-moon-sm">
    <UICard.Header>
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div class="flex flex-col gap-y-1.5">
          <UICard.Title class="text-moon-16 font-semibold">{{ t("stats.chart.title") }}</UICard.Title>
          <UICard.Subtitle class="text-moon-12 text-trunks">{{ t("stats.chart.subtitle") }}</UICard.Subtitle>
        </div>
        <!-- One series at a time: the owner picks the metric the card is about, the axis stays the days. -->
        <UIToggleGroup
          :model-value="metric"
          size="sm"
          @update:model-value="(value) => (metric = (value || metric) as ChartMetric)"
        >
          <UIToggleGroupItem v-for="item of metrics" :key="item" :value="item" :data-toggle="item">
            {{ t(`stats.chart.metric.${item}`) }}
          </UIToggleGroupItem>
        </UIToggleGroup>
      </div>
    </UICard.Header>
    <UICard.Body>
      <SeriesChart :points="points" :preset="preset" :now="now" :metric="metric" />
    </UICard.Body>
  </UICard.Root>
</template>
