<script setup lang="ts">
import type { IBlockPropertyImage } from "@links/blocks";

import { UIFileUpload, UIInputHint, UIInputLabel } from "@links/ui";
import { StorageApi } from "~shared/api/backend";
import { resolveBlockImageUrl, storesAsset } from "~shared/blocks";

interface IImageFieldProps {
  field: IBlockPropertyImage;
  id: string;
}
const props = defineProps<IImageFieldProps>();

const model = defineModel<IBlockPropertyImage["value"]>();

const isUploading = ref(false);
const file = ref<File | null>(model.value ? new File([], model.value) : null);

/** The value this field last uploaded itself: the picked file already carries that name. */
let lastUploaded: string | null = null;

/**
 * A list row is keyed by its position, so duplicating or deleting a row hands this instance another
 * row's value. Seeding `file` once would then show the previous row's file name beside the new
 * preview, so the file list follows the model — except right after an upload, where the picked file
 * names itself and replacing it with the stored id would only lose that name.
 */
watch(model, (value) => {
  if (value === lastUploaded) return;
  file.value = value ? new File([], value) : null;
});

/**
 * A field whose `accept` offers no image type holds an uploaded asset instead: a video, an audio clip
 * or a pdf goes to the asset endpoint, whose allowlist decides what the server keeps.
 */
const storesAnAsset = computed(() => storesAsset(props.field.accept));

const config = useRuntimeConfig();
/** An `<img>` cannot draw a video or a pdf, so an asset keeps its file name and no preview. */
const previewUrl = computed(() =>
  storesAnAsset.value ? undefined : resolveBlockImageUrl(model.value, { origin: config.public.backendUrl }),
);

async function handleChange(payload: File | File[] | null) {
  const picked = Array.isArray(payload) ? payload[0] : payload;
  if (!picked) {
    model.value = undefined;
    return;
  }

  isUploading.value = true;
  try {
    const uploaded = storesAnAsset.value ? await StorageApi.uploadAsset(picked) : await StorageApi.uploadImage(picked);
    lastUploaded = uploaded;
    model.value = uploaded;
  } finally {
    isUploading.value = false;
  }
}
</script>

<template>
  <UIInputLabel :for="id">
    {{ field.label }}
  </UIInputLabel>
  <UIFileUpload.Root
    v-model="file"
    class="flex flex-col gap-2"
    :accept="field.accept ?? 'image/*'"
    @change="handleChange"
  >
    <UIFileUpload.Trigger
      :id="`${id}-file`"
      :disabled="isUploading"
      class="w-fit inline-flex cursor-pointer items-center gap-2 border border-beerus rounded-moon-i-sm px-3 py-1.5 text-moon-14 text-bulma transition-colors disabled:cursor-not-allowed hover:bg-gohan disabled:opacity-60"
    >
      <span class="i-lucide:upload h-4 w-4 text-trunks" />
      <span>{{ isUploading ? "Uploading..." : storesAnAsset ? "Choose file" : "Choose image" }}</span>
    </UIFileUpload.Trigger>

    <UIFileUpload.FileList>
      <template #default="{ file: item, remove }">
        <div
          class="flex items-center gap-2 border border-beerus rounded-moon-i-sm bg-goku p-1.5 text-moon-14 text-bulma"
        >
          <img
            v-if="previewUrl"
            :src="previewUrl"
            :alt="field.label"
            class="h-9 w-9 shrink-0 rounded-moon-i-xs object-cover"
          />
          <span class="min-w-0 flex-1 truncate">{{ item.name }}</span>
          <button
            type="button"
            class="i-lucide:x ml-auto h-4 w-4 shrink-0 cursor-pointer text-trunks hover:text-chichi"
            @click="remove"
          />
        </div>
      </template>
    </UIFileUpload.FileList>
  </UIFileUpload.Root>
  <UIInputHint v-if="field.hint">
    {{ field.hint }}
  </UIInputHint>
</template>
