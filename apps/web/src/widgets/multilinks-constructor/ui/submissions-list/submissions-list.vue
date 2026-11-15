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
 * whole editor, so a block's messages must not stay on screen under its neighbour's name.
 *
 * A read that fails is not an empty page: "no submissions yet" would tell the owner nobody wrote to them
 * while the truth is that nothing could be asked. Both states are written out; neither is a spinner.
 */
const submissions = ref<FormSubmission[]>([]);
const failed = ref(false);

async function load() {
  const id = linkId.value;

  if (!id) {
    submissions.value = [];
    failed.value = false;
    return;
  }

  const { submissions: rows, failed: unread } = await LinksApi.getLinkSubmissions(id, props.blockId);
  submissions.value = rows;
  failed.value = unread;
}

watch([() => props.blockId, linkId], load, { immediate: true });

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="text-moon-12 text-trunks">Messages are stored here, on your page — nothing is emailed.</p>

    <p v-if="failed" class="text-moon-14 text-trunks">Could not load submissions.</p>
    <p v-else-if="submissions.length === 0" class="text-moon-14 text-trunks">No submissions yet.</p>
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
