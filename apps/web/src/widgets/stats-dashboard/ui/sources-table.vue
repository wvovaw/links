<script setup lang="ts">
import type { StatsSource } from "~shared/api/backend";

import { UICard, UITable } from "@links/ui";

const props = defineProps<{ sources: StatsSource[] }>();

const { t } = useI18n();

/** The mediums the app classifies itself; anything else is a utm medium the visitor's link chose. */
const knownMediums = new Set(["direct", "internal", "search", "social", "referral"]);

const mediumLabel = (medium: string) => (knownMediums.has(medium) ? t(`stats.medium.${medium}`) : medium);

/* Share of views, never of visitors: one person can arrive from two sources, and then they are two rows. */
const views = computed(() => props.sources.reduce((sum, source) => sum + source.views, 0));

function shareOf(source: StatsSource) {
  return views.value ? `${Math.round((source.views / views.value) * 100)}%` : "—";
}
</script>

<template>
  <UICard.Root class="rounded-moon-s-md bg-gohan shadow-moon-sm">
    <UICard.Header>
      <UICard.Title class="text-moon-16 font-semibold">{{ t("stats.sources.title") }}</UICard.Title>
    </UICard.Header>
    <UICard.Body class="p-0">
      <p v-if="!props.sources.length" class="px-4 pb-4 text-moon-12 text-trunks" data-testid="sources-empty">
        {{ t("stats.sources.empty") }}
      </p>

      <UITable.Root v-else class="w-full">
        <UITable.Header>
          <UITable.Head>{{ t("stats.sources.source") }}</UITable.Head>
          <UITable.Head>{{ t("stats.sources.medium") }}</UITable.Head>
          <UITable.Head class="text-right">{{ t("stats.totals.views") }}</UITable.Head>
          <UITable.Head class="text-right">{{ t("stats.sources.share") }}</UITable.Head>
        </UITable.Header>
        <UITable.Body>
          <UITable.Row
            v-for="source of props.sources"
            :key="`${source.source}|${source.medium}`"
            :data-source="source.source"
            :data-medium="source.medium"
          >
            <UITable.Cell class="font-semibold">{{ source.source }}</UITable.Cell>
            <UITable.Cell class="text-trunks">{{ mediumLabel(source.medium) }}</UITable.Cell>
            <UITable.Cell class="text-right">{{ source.views }}</UITable.Cell>
            <UITable.Cell class="text-right text-trunks">{{ shareOf(source) }}</UITable.Cell>
          </UITable.Row>
        </UITable.Body>
      </UITable.Root>
    </UICard.Body>
  </UICard.Root>
</template>
