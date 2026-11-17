<script setup lang="ts">
import type { LinkStats } from "~shared/api/backend";

import { AnalyticsApi, LinksApi } from "~shared/api/backend";
import { RangePicker, SourcesTable, TotalsCards, VisitsChart, useStatsRange } from "~widgets/stats-dashboard";

const props = defineProps<{ linkId: string }>();

const { t } = useI18n();

const now = new Date();
const { preset, range } = useStatsRange(now);

const stats = ref<LinkStats | null>(null);
const failed = ref(false);

/**
 * A block id is four random characters; the owner knows their blocks by what they hold. The names come from
 * the page itself, and a failed fetch leaves the ids rather than blanking the rows.
 */
const blockNames = ref<Record<string, string>>({});

async function loadBlocks() {
  try {
    const link = await LinksApi.getLink(props.linkId);
    const named = (link?.blocks ?? []) as { id: string; name: string }[];

    blockNames.value = Object.fromEntries(named.map((block) => [block.id, block.name]));
  } catch {
    blockNames.value = {};
  }
}

async function loadStats() {
  const result = await AnalyticsApi.getLinkStats(props.linkId, range.value);

  stats.value = result.stats;
  failed.value = result.failed;
}

watch(range, loadStats, { immediate: true });
onMounted(loadBlocks);
</script>

<template>
  <div class="flex flex-col gap-6">
    <RangePicker v-model="preset" />

    <p v-if="failed" class="text-moon-14 text-chichi" data-testid="stats-failed">{{ t("stats.failed") }}</p>

    <template v-else-if="stats">
      <TotalsCards :totals="stats.totals" show-ctr />
      <VisitsChart :points="stats.timeseries" :preset="preset" :now="now" />
      <SourcesTable :sources="stats.sources" />

      <section class="flex flex-col gap-2">
        <h2 class="text-moon-16 font-semibold">{{ t("stats.blocks.title") }}</h2>

        <table v-if="stats.blocks.length" class="w-full text-moon-12">
          <tbody>
            <tr v-for="block of stats.blocks" :key="block.blockId" :data-block-id="block.blockId">
              <td>{{ blockNames[block.blockId] ?? block.blockId }}</td>
              <td class="text-right">{{ block.clicks }}</td>
              <td class="text-right text-trunks">{{ block.visitors }}</td>
            </tr>
          </tbody>
        </table>

        <p v-else class="text-moon-12 text-trunks">{{ t("stats.blocks.empty") }}</p>
      </section>
    </template>
  </div>
</template>
