<script setup lang="ts">
import type { IBlockPropertyImage } from "@links/blocks";

import { UIFileUpload, UIInputHint, UIInputLabel } from "@links/ui";
import { StorageApi } from "~shared/api/backend";

interface IImageFieldProps {
  field: IBlockPropertyImage;
  id: string;
}
defineProps<IImageFieldProps>();

const model = defineModel<IBlockPropertyImage["value"]>();

const isUploading = ref(false);
const file = ref<File | null>(model.value ? new File([], model.value) : null);

const config = useRuntimeConfig();
const previewUrl = computed(() => StorageApi.resolveImageUrl(model.value, { origin: config.public.backendUrl }));

async function handleChange(payload: File | File[] | null) {
  const picked = Array.isArray(payload) ? payload[0] : payload;
  if (!picked) {
    model.value = undefined;
    return;
  }

  isUploading.value = true;
  try {
    model.value = await StorageApi.uploadImage(picked);
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
      <span>{{ isUploading ? "Uploading..." : "Choose image" }}</span>
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
