<script setup lang="ts">
import type { StatsSource } from "~shared/api/backend";

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
  <section class="flex flex-col gap-2">
    <h2 class="text-moon-16 font-semibold">{{ t("stats.sources.title") }}</h2>

    <p v-if="!props.sources.length" class="text-moon-12 text-trunks" data-testid="sources-empty">
      {{ t("stats.sources.empty") }}
    </p>

    <table v-else class="w-full text-moon-12">
      <tbody>
        <tr
          v-for="source of props.sources"
          :key="`${source.source}|${source.medium}`"
          :data-source="source.source"
          :data-medium="source.medium"
        >
          <td>{{ source.source }}</td>
          <td class="text-trunks">{{ mediumLabel(source.medium) }}</td>
          <td class="text-right">{{ source.views }}</td>
          <td class="text-right text-trunks">{{ shareOf(source) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
