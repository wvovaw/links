<script setup lang="ts">
import { useFileUploadContext } from "./useFileUploadContext";

const { clearFiles } = useFileUploadContext();
</script>

<template>
  <button type="button" @click="clearFiles">
    <slot />
  </button>
</template>
