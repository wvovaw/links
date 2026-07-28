<script setup lang="ts">
import { useFileUploadContext } from "./useFileUploadContext";

const { openFilePicker } = useFileUploadContext();
</script>

<template>
  <button type="button" @click="openFilePicker">
    <slot />
  </button>
</template>
