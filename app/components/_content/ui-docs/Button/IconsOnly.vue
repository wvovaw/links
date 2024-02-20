<script setup lang="ts">
import Previewbox from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
</script>

<template>
  <Previewbox>
    <UIButton size="xs" icon="i-lucide:box" aria-label="icon only element" />
    <UIButton size="sm" icon="i-lucide:box" aria-label="icon only element" />
    <UIButton icon="i-lucide:box" aria-label="icon only element" />
    <UIButton size="lg" icon="i-lucide:box" aria-label="icon only element" />
    <UIButton size="xl" icon="i-lucide:box" aria-label="icon only element" />
  </Previewbox>
</template>
