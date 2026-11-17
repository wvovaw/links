import type { ComputedRef, Ref } from "vue";
import type { StatsRange } from "~shared/api/backend";

import { computed, ref } from "vue";

import type { StatsRangePreset } from "./fill-days";

/**
 * The window a screen shows: a preset the visitor picks, and the bounds the API is asked with. `all time`
 * sends neither bound; the other two count back from the same clock the chart draws its axis from, so the
 * query and the bars always describe one window.
 */
export function useStatsRange(now: Date = new Date()): {
  preset: Ref<StatsRangePreset>;
  range: ComputedRef<StatsRange>;
} {
  const preset = ref<StatsRangePreset>("7d");

  const range = computed<StatsRange>(() => {
    if (preset.value === "all") return {};

    const days = preset.value === "7d" ? 6 : 29;

    return {
      from: new Date(now.getTime() - days * 86_400_000).toISOString(),
      to: now.toISOString(),
    };
  });

  return { preset, range };
}
