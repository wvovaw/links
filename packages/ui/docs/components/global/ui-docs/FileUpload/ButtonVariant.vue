<script setup lang="ts">
import { UIFileUploadButton } from "~ui/FileUpload";

import PreviewFrame from "../PreviewFrame.vue";

const files = ref<File[]>([]);
</script>

<template>
  <PreviewFrame>
    <div class="max-w-lg w-full flex flex-col">
      <UIFileUploadButton v-model="files" multiple label="Attach files" reset-label="Clear all" />
    </div>
  </PreviewFrame>
</template>
