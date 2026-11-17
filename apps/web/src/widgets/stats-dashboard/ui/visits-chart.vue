<script setup lang="ts">
import type { StatsPoint } from "~shared/api/backend";

import { UICard } from "@links/ui";

import type { StatsRangePreset } from "../model";

import { withEmptyDays } from "../model";

const props = defineProps<{
  points: StatsPoint[];
  preset: StatsRangePreset;
  /** The clock the axis is drawn from, passed in so a test — and the screen beside it — use one instant. */
  now: Date;
}>();

const { t } = useI18n();

const days = computed(() => withEmptyDays(props.points, props.preset, props.now));

/** A quiet range has no maximum to scale against; one keeps every bar at zero instead of dividing by it. */
const peak = computed(() => Math.max(1, ...days.value.map((day) => day.views)));
const slot = computed(() => 100 / Math.max(1, days.value.length));

function heightOf(views: number) {
  return (views / peak.value) * 100;
}
</script>

<template>
  <UICard.Root class="rounded-moon-s-md bg-gohan shadow-moon-sm">
    <UICard.Header>
      <UICard.Title class="text-moon-16 font-semibold">{{ t("stats.chart.title") }}</UICard.Title>
      <UICard.Subtitle class="text-moon-12 text-trunks">{{ t("stats.chart.subtitle") }}</UICard.Subtitle>
    </UICard.Header>
    <UICard.Body>
      <!--
        The bars are decoration around numbers printed elsewhere — the totals and the source table carry the
        meaning — so the drawing is hidden from assistive technology rather than given a second name.
      -->
      <svg
        class="h-32 w-full fill-current text-goten"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <rect
          v-for="(day, index) of days"
          :key="day.date"
          :data-date="day.date"
          :data-views="day.views"
          :x="index * slot"
          :y="100 - heightOf(day.views)"
          :width="slot * 0.8"
          :height="heightOf(day.views)"
          rx="1"
        >
          <title>{{ day.date }} — {{ day.views }}</title>
        </rect>
      </svg>
    </UICard.Body>
  </UICard.Root>
</template>
