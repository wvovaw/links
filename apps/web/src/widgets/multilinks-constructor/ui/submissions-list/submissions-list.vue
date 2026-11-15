<script setup lang="ts">
import type { FormSubmission } from "~shared/api/backend";

import { LinksApi } from "~shared/api/backend";

import { useConstructorStore } from "../../model";

const props = defineProps<{
  blockId: string;
}>();

const { linkId } = storeToRefs(useConstructorStore());

/**
 * Read when the panel opens and again whenever another block is selected: the panel is mounted once for the
 * whole editor, so a block's messages must not stay on screen under its neighbour's name. A failed or empty
 * fetch leaves the list empty, which reads as "none yet" — never as a spinner that never resolves.
 */
const submissions = ref<FormSubmission[]>([]);

async function load() {
  const id = linkId.value;
  submissions.value = id ? await LinksApi.getLinkSubmissions(id, props.blockId) : [];
}

watch([() => props.blockId, linkId], load, { immediate: true });

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="text-moon-12 text-trunks">Messages are stored here, on your page — nothing is emailed.</p>

    <p v-if="submissions.length === 0" class="text-moon-14 text-trunks">No submissions yet.</p>
    <ul v-else class="flex flex-col gap-3">
      <li
        v-for="submission of submissions"
        :key="submission.id"
        class="flex flex-col gap-1 border-s-2 border-beerus ps-2"
      >
        <span class="text-moon-12 text-trunks">{{ formatDate(submission.createdAt) }}</span>
        <span v-if="submission.payload.name" class="text-moon-14 font-semibold break-words">
          {{ submission.payload.name }}
        </span>
        <span class="text-moon-14 break-all">{{ submission.payload.email }}</span>
        <span v-if="submission.payload.message" class="text-moon-14 whitespace-pre-line break-words">
          {{ submission.payload.message }}
        </span>
      </li>
    </ul>
  </div>
</template>
