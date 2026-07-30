<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { useFileUploadContext } from "./useFileUploadContext";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const { files, removeFile, multiple } = useFileUploadContext();
</script>

<template>
  <div v-if="files.length > 0" :class="props.class">
    <template v-for="(file, index) in files" :key="`${file.name}-${file.size}-${file.lastModified}`">
      <slot :file="file" :index="index" :remove="() => removeFile(index)" :multiple="multiple" />
    </template>
  </div>
</template>
