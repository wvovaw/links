<script setup lang="ts">
import { UIFileUpload } from "~ui/FileUpload";

import PreviewFrame from "../PreviewFrame.vue";

const avatar = ref<File | null>(null);

const previewUrl = computed(() => {
  if (avatar.value) return URL.createObjectURL(avatar.value);
  return "";
});
</script>

<template>
  <PreviewFrame>
    <div class="flex flex-col items-center gap-3">
      <UIFileUpload.Root v-model="avatar" accept="image/*">
        <UIFileUpload.Dropzone v-slot="{ isOver }">
          <div
            class="grid h-24 w-24 cursor-pointer place-content-center overflow-hidden border-2 rounded-full border-dashed"
            :class="[isOver ? 'border-piccolo' : avatar ? 'border-transparent' : 'border-beerus']"
          >
            <img v-if="avatar" :src="previewUrl" class="h-full w-full object-cover" alt="avatar" />
            <span v-else class="i-lucide:camera h-6 w-6 text-trunks" />
          </div>
        </UIFileUpload.Dropzone>
      </UIFileUpload.Root>
      <span class="text-moon-14 text-trunks">Click to upload avatar</span>
    </div>
  </PreviewFrame>
</template>
