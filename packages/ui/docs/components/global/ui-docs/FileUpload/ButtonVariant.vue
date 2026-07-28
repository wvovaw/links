<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIFileUploadButton } from "~ui/FileUpload";

const files = ref<File[]>([]);
</script>

<template>
  <PreviewFrame>
    <div class="max-w-lg w-full flex flex-col">
      <UIFileUploadButton v-model="files" multiple label="Attach files" reset-label="Clear all" />
    </div>
  </PreviewFrame>
</template>
