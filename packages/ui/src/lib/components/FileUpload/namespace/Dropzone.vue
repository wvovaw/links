<script setup lang="ts">
import { useDropZone } from "@vueuse/core";
import { type HTMLAttributes, ref } from "vue";
import { useFileUploadContext } from "./useFileUploadContext";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const { addFiles, openFilePicker } = useFileUploadContext();

const dropZoneRef = ref<HTMLDivElement>();

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop(files) {
    if (files)
      addFiles(Array.from(files));
  },
});

function onClick() {
  openFilePicker();
}
</script>

<template>
  <div
    ref="dropZoneRef"
    :class="props.class"
    @click="onClick"
  >
    <slot :is-over="isOverDropZone" />
  </div>
</template>
