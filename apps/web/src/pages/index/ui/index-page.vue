<script setup lang="ts">
import type { OverviewStats } from "~shared/api/backend";

import { UICard, UISkeleton, UITable } from "@links/ui";
import { AnalyticsApi } from "~shared/api/backend";
import { RangePicker, SourcesTable, TotalsCards, TrafficChart, useStatsRange } from "~widgets/stats-dashboard";

const { t } = useI18n();

/** One clock for the axis and for the query, so the bars and the numbers describe the same window. */
const now = new Date();
const { preset, range } = useStatsRange(now);

const stats = ref<OverviewStats | null>(null);
const failed = ref(false);
const loading = ref(true);

async function load() {
  loading.value = true;

  const result = await AnalyticsApi.getOverview(range.value);

  stats.value = result.stats;
  failed.value = result.failed;
  loading.value = false;
}

watch(range, load, { immediate: true });
</script>

<template>
  <main class="flex flex-1 flex-col gap-4 p-4 sm:gap-8 sm:p-10">
    <div class="mx-auto flex max-w-6xl w-full flex-wrap items-center justify-between gap-3">
      <h1 class="text-moon-24 font-semibold">{{ t("stats.title") }}</h1>
      <RangePicker v-model="preset" />
    </div>

    <div class="mx-auto flex max-w-6xl w-full flex-col gap-4 sm:gap-6">
      <UICard.Root v-if="failed" class="rounded-moon-s-md bg-gohan shadow-moon-sm">
        <UICard.Body>
          <p class="text-moon-14" data-testid="stats-failed">{{ t("stats.failed") }}</p>
        </UICard.Body>
      </UICard.Root>

      <template v-else-if="loading">
        <div class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <UISkeleton v-for="index of 3" :key="index" class="h-20 rounded-moon-s-md" />
        </div>
        <UISkeleton class="h-48 rounded-moon-s-md" />
      </template>

      <template v-else-if="stats">
        <TotalsCards :totals="stats.totals" />
        <TrafficChart :points="stats.timeseries" :preset="preset" :now="now" />

        <div class="grid gap-4 lg:grid-cols-2 lg:items-start">
          <SourcesTable :sources="stats.sources" />

          <UICard.Root class="rounded-moon-s-md bg-gohan shadow-moon-sm">
            <UICard.Header>
              <UICard.Title class="text-moon-16 font-semibold">{{ t("stats.links.title") }}</UICard.Title>
            </UICard.Header>
            <UICard.Body class="p-0">
              <p v-if="!stats.links.length" class="px-4 pb-4 text-moon-12 text-trunks">
                {{ t("stats.links.empty") }}
              </p>

              <UITable.Root v-else class="w-full">
                <UITable.Header>
                  <UITable.Head>{{ t("stats.pages.page") }}</UITable.Head>
                  <UITable.Head class="text-right">{{ t("stats.totals.views") }}</UITable.Head>
                  <UITable.Head class="text-right">{{ t("stats.totals.visitors") }}</UITable.Head>
                  <UITable.Head class="text-right">{{ t("stats.totals.clicks") }}</UITable.Head>
                </UITable.Header>
                <UITable.Body>
                  <UITable.Row v-for="row of stats.links" :key="row.id" :data-link-slug="row.slug">
                    <UITable.Cell class="font-semibold">
                      <NuxtLinkLocale :to="{ name: 'links-id-stats', params: { id: row.id } }" class="hover:underline">
                        {{ row.title }}
                      </NuxtLinkLocale>
                    </UITable.Cell>
                    <UITable.Cell class="text-right">{{ row.views }}</UITable.Cell>
                    <UITable.Cell class="text-right">{{ row.visitors }}</UITable.Cell>
                    <UITable.Cell class="text-right">{{ row.clicks }}</UITable.Cell>
                  </UITable.Row>
                </UITable.Body>
              </UITable.Root>
            </UICard.Body>
          </UICard.Root>
        </div>
      </template>
    </div>
  </main>
</template>
