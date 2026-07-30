<script setup lang="ts">
import { UIFileUploadDropzone } from "~ui/FileUpload";

import PreviewFrame from "../PreviewFrame.vue";

const file = ref<File | null>(null);
</script>

<template>
  <PreviewFrame>
    <div class="max-w-lg w-full flex flex-col">
      <UIFileUploadDropzone v-model="file" accept="image/*" />
      <p v-if="file" class="mt-2 text-moon-12 text-bulma">Selected: {{ file.name }}</p>
    </div>
  </PreviewFrame>
</template>
