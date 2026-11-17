<script setup lang="ts">
import type { StatsTotals } from "~shared/api/backend";

const props = defineProps<{
  totals: StatsTotals;
  /** The per-page screen shows CTR; the overview does not, because it would average the pages' rates. */
  showCtr?: boolean;
}>();

const { t } = useI18n();

/** With no visits there is no rate to print: a dash, never `NaN` or `Infinity`. */
const ctr = computed(() =>
  props.totals.views ? `${Math.round((props.totals.clicks / props.totals.views) * 100)}%` : "—",
);
</script>

<template>
  <dl class="flex flex-wrap gap-8">
    <div class="flex flex-col" data-metric="views">
      <dt class="text-moon-12 text-trunks">{{ t("stats.totals.views") }}</dt>
      <dd class="text-moon-16 font-semibold">{{ props.totals.views }}</dd>
    </div>
    <div class="flex flex-col" data-metric="visitors">
      <dt class="text-moon-12 text-trunks">{{ t("stats.totals.visitors") }}</dt>
      <dd class="text-moon-16 font-semibold">{{ props.totals.visitors }}</dd>
    </div>
    <div class="flex flex-col" data-metric="clicks">
      <dt class="text-moon-12 text-trunks">{{ t("stats.totals.clicks") }}</dt>
      <dd class="text-moon-16 font-semibold">{{ props.totals.clicks }}</dd>
    </div>
    <div v-if="props.showCtr" class="flex flex-col" data-metric="ctr">
      <dt class="text-moon-12 text-trunks">{{ t("stats.totals.ctr") }}</dt>
      <dd class="text-moon-16 font-semibold">{{ ctr }}</dd>
    </div>
  </dl>
</template>
