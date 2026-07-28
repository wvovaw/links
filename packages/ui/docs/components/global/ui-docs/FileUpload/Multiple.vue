<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIFileUploadDropzone } from "~ui/FileUpload";

const files = ref<File[]>([]);
</script>

<template>
  <PreviewFrame>
    <div class="max-w-lg w-full flex flex-col">
      <UIFileUploadDropzone v-model="files" multiple />
    </div>
  </PreviewFrame>
</template>
