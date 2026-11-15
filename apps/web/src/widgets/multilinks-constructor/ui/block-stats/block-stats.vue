<script setup lang="ts">
import type { BlockStats } from "~shared/api/backend";

import { LinksApi } from "~shared/api/backend";

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
  if (id) stats.value = await LinksApi.getLinkStats(id);
});

const counters = computed<BlockStats>(
  () => stats.value.find((entry) => entry.blockId === props.blockId) ?? { blockId: props.blockId, clicks: 0, views: 0 },
);
</script>

<template>
  <dl class="flex gap-6">
    <div class="flex flex-col">
      <dt class="text-moon-12 text-trunks">Clicks</dt>
      <dd class="text-moon-16 font-semibold">
        {{ counters.clicks }}
      </dd>
    </div>
    <div class="flex flex-col">
      <dt class="text-moon-12 text-trunks">Views</dt>
      <dd class="text-moon-16 font-semibold">
        {{ counters.views }}
      </dd>
    </div>
  </dl>
</template>
