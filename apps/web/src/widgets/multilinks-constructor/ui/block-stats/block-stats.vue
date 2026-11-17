<script setup lang="ts">
import type { BlockStats } from "~shared/api/backend";

import { AnalyticsApi } from "~shared/api/backend";

import { useConstructorStore } from "../../model";

const props = defineProps<{
  blockId: string;
}>();

const { linkId } = storeToRefs(useConstructorStore());

/**
 * Read once, when the panel opens: a page's past events do not change while its owner edits it. A failed
 * or empty fetch leaves the list empty, which reads as zeros — never as a spinner that never resolves.
 */
const stats = ref<BlockStats[]>([]);

onMounted(async () => {
  const id = linkId.value;
  if (id) stats.value = (await AnalyticsApi.getLinkStats(id)).stats?.blocks ?? [];
});

const counters = computed<BlockStats>(
  () =>
    stats.value.find((entry) => entry.blockId === props.blockId) ?? { blockId: props.blockId, clicks: 0, visitors: 0 },
);

/*
  Only clicks are shown. Views belong to the page, not to a block: the page reports one visit per document,
  and a beacon per block per visit would exhaust the per-block window and answer 429 to real clicks. The
  statistics screen is where a page's views and its sources are read.
*/
</script>

<template>
  <dl class="flex flex-col">
    <dt class="text-moon-12 text-trunks">Clicks</dt>
    <dd class="text-moon-16 font-semibold">
      {{ counters.clicks }}
    </dd>
  </dl>
</template>
