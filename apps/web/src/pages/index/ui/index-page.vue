<script setup lang="ts">
import type { OverviewStats } from "~shared/api/backend";

import { AnalyticsApi } from "~shared/api/backend";
import { RangePicker, SourcesTable, TotalsCards, VisitsChart, useStatsRange } from "~widgets/stats-dashboard";

const { t } = useI18n();

/** One clock for the axis and for the query, so the bars and the numbers describe the same window. */
const now = new Date();
const { preset, range } = useStatsRange(now);

const stats = ref<OverviewStats | null>(null);
const failed = ref(false);

async function load() {
  const result = await AnalyticsApi.getOverview(range.value);

  stats.value = result.stats;
  failed.value = result.failed;
}

watch(range, load, { immediate: true });
</script>

<template>
  <div class="flex flex-col gap-6">
    <RangePicker v-model="preset" />

    <p v-if="failed" class="text-moon-14 text-chichi" data-testid="stats-failed">{{ t("stats.failed") }}</p>

    <template v-else-if="stats">
      <TotalsCards :totals="stats.totals" />
      <VisitsChart :points="stats.timeseries" :preset="preset" :now="now" />
      <SourcesTable :sources="stats.sources" />

      <section class="flex flex-col gap-2">
        <h2 class="text-moon-16 font-semibold">{{ t("stats.links.title") }}</h2>

        <table v-if="stats.links.length" class="w-full text-moon-12">
          <tbody>
            <tr v-for="row of stats.links" :key="row.id" :data-link-slug="row.slug">
              <td>
                <NuxtLinkLocale :to="{ name: 'links-id-stats', params: { id: row.id } }">
                  {{ row.title }}
                </NuxtLinkLocale>
              </td>
              <td class="text-right">{{ row.views }}</td>
              <td class="text-right">{{ row.visitors }}</td>
              <td class="text-right">{{ row.clicks }}</td>
            </tr>
          </tbody>
        </table>

        <p v-else class="text-moon-12 text-trunks">{{ t("stats.links.empty") }}</p>
      </section>
    </template>
  </div>
</template>
