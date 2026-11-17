<script setup lang="ts">
import type { StatsTotals } from "~shared/api/backend";

import { UICard } from "@links/ui";

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

const metrics = computed(() => [
  { id: "views", label: t("stats.totals.views"), value: props.totals.views },
  { id: "visitors", label: t("stats.totals.visitors"), value: props.totals.visitors },
  { id: "clicks", label: t("stats.totals.clicks"), value: props.totals.clicks },
  ...(props.showCtr ? [{ id: "ctr", label: t("stats.totals.ctr"), value: ctr.value }] : []),
]);
</script>

<template>
  <dl class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
    <UICard.Root
      v-for="metric of metrics"
      :key="metric.id"
      :data-metric="metric.id"
      class="rounded-moon-s-md bg-gohan shadow-moon-sm"
    >
      <UICard.Body class="flex flex-col gap-1">
        <dt class="text-moon-12 text-trunks">{{ metric.label }}</dt>
        <dd class="text-moon-24 font-semibold">{{ metric.value }}</dd>
      </UICard.Body>
    </UICard.Root>
  </dl>
</template>
