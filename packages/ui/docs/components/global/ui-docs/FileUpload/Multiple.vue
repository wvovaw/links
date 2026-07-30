<script setup lang="ts">
import { UIFileUploadDropzone } from "~ui/FileUpload";

import PreviewFrame from "../PreviewFrame.vue";

const files = ref<File[]>([]);
</script>

<template>
  <PreviewFrame>
    <div class="max-w-lg w-full flex flex-col">
      <UIFileUploadDropzone v-model="files" multiple />
    </div>
  </PreviewFrame>
</template>
