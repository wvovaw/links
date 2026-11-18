<script setup lang="ts">
import type { StatsPoint } from "~shared/api/backend";

import { UICard, UIToggleGroup, UIToggleGroupItem } from "@links/ui";
import { VisArea, VisAxis, VisCrosshair, VisTooltip, VisXYContainer } from "@unovis/vue";

import type { ChartMetric, ChartRow, StatsRangePreset } from "../model";

import { chartRows, describeDay, tickIndexes, withEmptyDays } from "../model";

const props = defineProps<{
  points: StatsPoint[];
  preset: StatsRangePreset;
  /** The clock the axis is drawn from, passed in so a test — and the screen beside it — use one instant. */
  now: Date;
}>();

const { t } = useI18n();

const metrics: ChartMetric[] = ["views", "visitors", "clicks"];
const metric = ref<ChartMetric>("views");

const days = computed(() => withEmptyDays(props.points, props.preset, props.now));
const rows = computed(() => chartRows(days.value));
const ticks = computed(() => tickIndexes(rows.value.length));

const x = (row: ChartRow) => row.index;
/** A fresh function per metric: the library compares accessors by reference, and an unchanged one draws the old series. */
const y = computed(() => (row: ChartRow) => row[metric.value]);
/** The accent token fades downward, so the area reads as traffic under a line rather than a solid block. */
const fill = () => "url(#traffic-chart-fill)";
const stroke = () => "currentColor";
const formatTick = (tick: number | Date) => rows.value[Number(tick)]?.label ?? "";
/** The area's own datum is the whole series, so the day under the pointer comes from the crosshair. */
const describePoint = (row: ChartRow) => describeDay(row, metric.value);
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
      <!--
        The chart measures its container, so it exists in the browser only; the box holds its height on the
        server so the card does not jump when the area arrives. Hovering a day names it and the chosen
        metric's count — the totals and the source table keep the meaning for a reader who never hovers.
      -->
      <div class="relative h-32 w-full text-piccolo" data-chart :data-metric="metric" :data-rows="rows.length">
        <!-- The fill is defined here because the library draws the path and only takes its colour from us. -->
        <svg class="absolute size-0" aria-hidden="true">
          <defs>
            <linearGradient id="traffic-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="currentColor" stop-opacity="0.35" />
              <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <ClientOnly>
          <VisXYContainer :data="rows" :height="128">
            <VisArea :x="x" :y="y" :color="fill" :line="true" :line-color="stroke" :line-width="2" />
            <VisAxis type="x" :tick-values="ticks" :tick-format="formatTick" :grid-line="false" :domain-line="false" />
            <VisCrosshair :template="describePoint" />
            <VisTooltip />
          </VisXYContainer>
        </ClientOnly>
      </div>
    </UICard.Body>
  </UICard.Root>
</template>
