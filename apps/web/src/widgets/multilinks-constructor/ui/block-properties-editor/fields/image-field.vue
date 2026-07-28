<script setup lang="ts">
import { UIButton, UIInputHint, UIInputLabel } from "@links/ui";
import type { IBlockPropertyImage } from "@links/blocks";
import { StorageApi } from "~shared/api/backend";

interface IImageFieldProps {
  field: IBlockPropertyImage;
  id: string;
}
defineProps<IImageFieldProps>();
const model = defineModel<IBlockPropertyImage["value"]>();

const config = useRuntimeConfig();
const isUploading = ref(false);
const previewUrl = computed(() =>
  StorageApi.resolveImageUrl(model.value, { origin: config.public.backendUrl }));

async function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file)
    return;

  isUploading.value = true;
  try {
    const fileId = await StorageApi.uploadImage(file);
    model.value = fileId;
  }
  finally {
    isUploading.value = false;
    input.value = "";
  }
}

function clearImage() {
  model.value = undefined;
}
</script>

<template>
  <UIInputLabel :for="id">
    {{ field.label }}
  </UIInputLabel>
  <div class="flex flex-col gap-2">
    <div v-if="previewUrl" class="relative">
      <img
        :src="previewUrl"
        :alt="field.label"
        class="max-h-40 w-full rounded-md object-cover"
      >
      <UIButton
        size="sm"
        variant="outline"
        color="chichi"
        icon="i-lucide:x"
        class="absolute right-1 top-1"
        @click="clearImage"
      />
    </div>
    <label
      :for="`${id}-file`"
      class="h-20 w-full flex cursor-pointer items-center justify-center border-2 border-beerus rounded-md border-dashed transition-colors hover:border-trunks"
    >
      <span v-if="isUploading" class="text-moon-20 text-beerus">Uploading...</span>
      <span v-else class="flex items-center gap-1 text-moon-20 text-beerus">
        <span class="i-lucide:upload text-lg" />
        Choose image
      </span>
      <input
        :id="`${id}-file`"
        type="file"
        :accept="field.accept ?? 'image/*'"
        class="hidden"
        @change="handleUpload"
      >
    </label>
  </div>
  <UIInputHint v-if="field.hint">
    {{ field.hint }}
  </UIInputHint>
</template>
