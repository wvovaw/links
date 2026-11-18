<script setup lang="ts">
import type { StatsPoint } from "~shared/api/backend";

import { VisArea, VisAxis, VisCrosshair, VisLine, VisTooltip, VisXYContainer } from "@unovis/vue";

import type { ChartRow, SparkMetric, StatsRangePreset } from "../model";

import { chartRows, describeDay, tickIndexes, withEmptyDays } from "../model";

const props = defineProps<{
  points: StatsPoint[];
  preset: StatsRangePreset;
  /** The clock the days are counted back from; passed in so a test, and the screen beside it, use one instant. */
  now: Date;
  metric: SparkMetric;
  /** A card's line: no axis to read and nothing to hover, in a box the size of a line. */
  compact?: boolean;
}>();

const rows = computed(() => chartRows(withEmptyDays(props.points, props.preset, props.now)));
const ticks = computed(() => tickIndexes(rows.value.length));

/** The library measures its container, so its height is a number here rather than a class. */
const height = computed(() => (props.compact ? 24 : 128));

const x = (row: ChartRow) => row.index;
/**
 * A fresh function per metric: the library compares accessors by reference, so an unchanged one leaves the
 * old series on the screen. The metric has to be read here, in the computed's own body — read inside the
 * accessor it would be untracked, and the computed would hand out its first function forever.
 */
const y = computed(() => {
  const metric = props.metric;
  return (row: ChartRow) => row[metric];
});
/** The accent token fades downward, so the area reads as traffic under a line rather than a solid block. */
const fill = () => "url(#traffic-chart-fill)";
const stroke = () => "currentColor";
const formatTick = (tick: number | Date) => rows.value[Number(tick)]?.label ?? "";
/** The area's own datum is the whole series, so the day under the pointer comes from the crosshair. */
const describePoint = (row: ChartRow) => describeDay(row, props.metric);
</script>

<template>
  <!--
    The chart measures its container, so it exists in the browser only; the box holds its size on the server so
    the card does not jump when the line arrives. `contain: inline-size` keeps the pixel width the library
    writes on its own svg out of the page's min-content: without it that fixed width pins the card, and with
    the card the whole page, at a desktop size, so a phone scrolls sideways instead of the chart re-measuring.
  -->
  <div
    class="relative text-piccolo"
    :class="compact ? 'h-6 w-20' : 'h-32 w-full [contain:inline-size]'"
    data-chart
    :data-metric="metric"
    :data-rows="rows.length"
  >
    <!-- The fill is defined here because the library draws the path and only takes its colour from us. -->
    <svg v-if="!compact" class="absolute size-0" aria-hidden="true">
      <defs>
        <linearGradient id="traffic-chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.35" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>

    <ClientOnly>
      <!--
        `prevent-empty-domain` is the line's own guard: a series whose every day is zero has a domain of one
        value, and the library collapses it to nothing. Undefined, not false, for the big chart: the library's
        own default keeps it off a collapsed axis, and "false" would turn that off.

        A flat series then lies on the floor of the box, where half the stroke is clipped — so the line is
        inset, and the screen's chart keeps the edges it has always had.
      -->
      <!--
        `v-bind`, not a prop bound to `undefined`: the library copies every vnode prop over its own default,
        so `:padding="… : undefined"` replaces `{ top: 0, bottom: 0, left: 0, right: 0 }` with `undefined`
        and the chart throws on `padding.left` before it draws a thing.
      -->
      <VisXYContainer
        :data="rows"
        :height="height"
        v-bind="compact ? { preventEmptyDomain: true, padding: { top: 2, bottom: 2 } } : {}"
      >
        <VisLine v-if="compact" :x="x" :y="y" :color="stroke" :line-width="2" />
        <template v-else>
          <VisArea :x="x" :y="y" :color="fill" :line="true" :line-color="stroke" :line-width="2" />
          <VisAxis type="x" :tick-values="ticks" :tick-format="formatTick" :grid-line="false" :domain-line="false" />
          <VisCrosshair :template="describePoint" />
          <VisTooltip />
        </template>
      </VisXYContainer>
    </ClientOnly>
  </div>
</template>
