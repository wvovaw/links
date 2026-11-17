<script setup lang="ts">
import type { StatsPoint } from "~shared/api/backend";

import { UICard } from "@links/ui";
import { VisAxis, VisStackedBar, VisStackedBarSelectors, VisTooltip, VisXYContainer } from "@unovis/vue";

import type { ChartRow, StatsRangePreset } from "../model";

import { chartRows, describeDay, tickIndexes, withEmptyDays } from "../model";

const props = defineProps<{
  points: StatsPoint[];
  preset: StatsRangePreset;
  /** The clock the axis is drawn from, passed in so a test — and the screen beside it — use one instant. */
  now: Date;
}>();

const { t } = useI18n();

const days = computed(() => withEmptyDays(props.points, props.preset, props.now));
const rows = computed(() => chartRows(days.value));
/** Bars are measured against the range's own peak; a quiet range still needs a scale to stand on. */
const peak = computed(() => Math.max(1, ...rows.value.map((row) => row.views)));
const ticks = computed(() => tickIndexes(rows.value.length));

const x = (row: ChartRow) => row.index;
const y = (row: ChartRow) => row.views;
/** The bars take the accent colour the buttons use: `goten` is white here, and white bars on a white card are invisible. */
const color = () => "currentColor";
const formatTick = (tick: number | Date) => rows.value[Number(tick)]?.label ?? "";
/** The datum hangs on the bar's group, not on the bar: the group is what the tooltip can read a day from. */
const triggers = { [VisStackedBarSelectors.barGroup]: describeDay };
</script>

<template>
  <UICard.Root class="rounded-moon-s-md bg-gohan shadow-moon-sm">
    <UICard.Header>
      <UICard.Title class="text-moon-16 font-semibold">{{ t("stats.chart.title") }}</UICard.Title>
      <UICard.Subtitle class="text-moon-12 text-trunks">{{ t("stats.chart.subtitle") }}</UICard.Subtitle>
    </UICard.Header>
    <UICard.Body>
      <!--
        The chart measures its container, so it exists in the browser only; the box holds its height on the
        server so the card does not jump when the bars arrive. Hovering a bar names its day and its count —
        the totals and the source table keep the meaning for a reader who never hovers.
      -->
      <div class="h-32 w-full text-piccolo">
        <ClientOnly>
          <VisXYContainer :data="rows" :height="128" :y-domain="[0, peak]">
            <VisStackedBar :x="x" :y="y" :color="color" :rounded-corners="2" />
            <VisAxis type="x" :tick-values="ticks" :tick-format="formatTick" :grid-line="false" :domain-line="false" />
            <VisTooltip :triggers="triggers" />
          </VisXYContainer>
        </ClientOnly>
      </div>
    </UICard.Body>
  </UICard.Root>
</template>
