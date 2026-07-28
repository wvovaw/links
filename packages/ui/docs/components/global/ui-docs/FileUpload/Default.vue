<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIFileUploadDropzone } from "~ui/FileUpload";

const file = ref<File | null>(null);
</script>

<template>
  <PreviewFrame>
    <div class="max-w-lg w-full flex flex-col">
      <UIFileUploadDropzone v-model="file" accept="image/*" />
      <p v-if="file" class="mt-2 text-moon-12 text-bulma">
        Selected: {{ file.name }}
      </p>
    </div>
  </PreviewFrame>
</template>
