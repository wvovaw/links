<script setup lang="ts">
import type { OverviewStats } from "~shared/api/backend";

import { UICard, UISkeleton } from "@links/ui";
import { AnalyticsApi } from "~shared/api/backend";
import { useLinksStore } from "~entities/links";
import { linksRows, MultilinksList } from "~widgets/multilinks-list";
import { RangePicker, TotalsCards, useStatsRange } from "~widgets/stats-dashboard";

const { t } = useI18n();

/** One clock for the query and the sparklines, so every number on the screen describes the same window. */
const now = new Date();
const { preset, range } = useStatsRange(now, "30d");

const linksStore = useLinksStore();
const { links } = storeToRefs(linksStore);

const stats = ref<OverviewStats | null>(null);
const failed = ref(false);
const loading = ref(true);

/** The rows the table prints: the owner's own list, each carrying the numbers the overview counted for it. */
const rows = computed(() => linksRows(links.value, stats.value?.links ?? []));

async function load() {
  loading.value = true;

  /* A list that could not be read still leaves the overview's numbers readable; the table shows the list. */
  const [overview] = await Promise.all([
    AnalyticsApi.getOverview(range.value),
    linksStore.refreshLinksList().catch(() => undefined),
  ]);

  stats.value = overview.stats;
  failed.value = overview.failed;
  loading.value = false;
}

watch(range, load, { immediate: true });
</script>

<template>
  <main class="flex flex-1 flex-col gap-4 p-4 sm:gap-8 sm:p-10">
    <div class="mx-auto flex max-w-6xl w-full flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <span class="grid size-12 shrink-0 place-content-center rounded-moon-s-md bg-piccolo text-moon-24 text-goku">
          <span class="i-lucide:link" aria-hidden="true" />
        </span>

        <div class="flex flex-col gap-1">
          <h1 class="text-moon-24 font-semibold">{{ t("links.title") }}</h1>
          <p class="text-moon-12 text-trunks">{{ t("links.subtitle") }}</p>
        </div>
      </div>

      <RangePicker v-model="preset" />
    </div>

    <div class="mx-auto flex max-w-6xl w-full flex-col gap-4 sm:gap-6">
      <UICard.Root v-if="failed" class="min-w-0 rounded-moon-s-md bg-gohan shadow-moon-sm">
        <UICard.Body>
          <p class="text-moon-14" data-testid="stats-failed">{{ t("stats.failed") }}</p>
        </UICard.Body>
      </UICard.Root>

      <template v-else-if="loading">
        <div class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <UISkeleton v-for="index of 4" :key="index" class="h-20 rounded-moon-s-md" />
        </div>
        <UISkeleton class="h-48 rounded-moon-s-md" />
      </template>

      <template v-else-if="stats">
        <TotalsCards
          :totals="stats.totals"
          :previous="stats.previous"
          show-ctr
          :series="{ points: stats.timeseries, preset, now }"
          class="min-w-0"
        />

        <MultilinksList :links="rows" class="min-w-0" @deleted="load" />
      </template>
    </div>
  </main>
</template>
