<script setup lang="ts">
import type { LinkStats } from "~shared/api/backend";

import { UIButton, UICard, UISkeleton, UITable } from "@links/ui";
import { AnalyticsApi, LinksApi } from "~shared/api/backend";
import { RangePicker, SourcesTable, TotalsCards, VisitsChart, useStatsRange } from "~widgets/stats-dashboard";

const props = defineProps<{ linkId: string }>();

const { t } = useI18n();
const config = useRuntimeConfig();

const now = new Date();
const { preset, range } = useStatsRange(now);

const stats = ref<LinkStats | null>(null);
const failed = ref(false);
const loading = ref(true);

/**
 * The page itself, for its title and for the names of its blocks: a block id is four random characters, and
 * the owner knows their blocks by what they hold. A failed fetch leaves the ids rather than blanking the rows.
 */
const page = ref<{ title?: string; slug?: string; blocks?: { id: string; name: string }[] } | null>(null);

const blockNames = computed(() =>
  Object.fromEntries((page.value?.blocks ?? []).map((block) => [block.id, block.name])),
);

const publicUrl = computed(() => (page.value?.slug ? `${config.public.baseUrl}/${page.value.slug}` : undefined));

async function loadPage() {
  try {
    page.value = (await LinksApi.getLink(props.linkId)) ?? null;
  } catch {
    page.value = null;
  }
}

async function loadStats() {
  loading.value = true;

  const result = await AnalyticsApi.getLinkStats(props.linkId, range.value);

  stats.value = result.stats;
  failed.value = result.failed;
  loading.value = false;
}

watch(range, loadStats, { immediate: true });
onMounted(loadPage);
</script>

<template>
  <main class="flex flex-1 flex-col gap-4 p-4 sm:gap-8 sm:p-10">
    <div class="mx-auto flex max-w-6xl w-full flex-wrap items-start justify-between gap-3">
      <div class="flex flex-col gap-1">
        <h1 class="text-moon-24 font-semibold">{{ page?.title ?? t("stats.title") }}</h1>
        <p v-if="page?.slug" class="text-moon-12 text-trunks">/{{ page.slug }}</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <RangePicker v-model="preset" />
        <NuxtLinkLocale :to="{ name: 'links-constructor-id', params: { id: props.linkId } }">
          <UIButton size="sm" icon="i-lucide:hammer" variant="ghost" as="span">
            {{ t("stats.page.edit") }}
          </UIButton>
        </NuxtLinkLocale>
        <UIButton v-if="publicUrl" size="sm" icon="i-lucide:external-link" variant="ghost" as-child>
          <a :href="publicUrl" target="_blank" rel="noreferrer">{{ t("stats.page.open") }}</a>
        </UIButton>
      </div>
    </div>

    <div class="mx-auto flex max-w-6xl w-full flex-col gap-4 sm:gap-6">
      <UICard.Root v-if="failed" class="rounded-moon-s-md bg-gohan shadow-moon-sm">
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
        <TotalsCards :totals="stats.totals" show-ctr />
        <VisitsChart :points="stats.timeseries" :preset="preset" :now="now" />

        <div class="grid gap-4 lg:grid-cols-2 lg:items-start">
          <SourcesTable :sources="stats.sources" />

          <UICard.Root class="rounded-moon-s-md bg-gohan shadow-moon-sm">
            <UICard.Header>
              <UICard.Title class="text-moon-16 font-semibold">{{ t("stats.blocks.title") }}</UICard.Title>
            </UICard.Header>
            <UICard.Body class="p-0">
              <p v-if="!stats.blocks.length" class="px-4 pb-4 text-moon-12 text-trunks">
                {{ t("stats.blocks.empty") }}
              </p>

              <UITable.Root v-else class="w-full">
                <UITable.Header>
                  <UITable.Head>{{ t("stats.blocks.block") }}</UITable.Head>
                  <UITable.Head class="text-right">{{ t("stats.totals.clicks") }}</UITable.Head>
                  <UITable.Head class="text-right">{{ t("stats.totals.visitors") }}</UITable.Head>
                </UITable.Header>
                <UITable.Body>
                  <UITable.Row v-for="block of stats.blocks" :key="block.blockId" :data-block-id="block.blockId">
                    <UITable.Cell class="font-semibold">
                      {{ blockNames[block.blockId] ?? block.blockId }}
                    </UITable.Cell>
                    <UITable.Cell class="text-right">{{ block.clicks }}</UITable.Cell>
                    <UITable.Cell class="text-right text-trunks">{{ block.visitors }}</UITable.Cell>
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
