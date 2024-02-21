<script setup lang="ts">
import Previewbox from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
</script>

<!-- eslint-disable vue/html-self-closing -->
<template>
  <Previewbox>
    <h4 class="w-full text-start">
      Self-closing tag
    </h4>
    <div class="w-full flex justify-around items-center">
      <UIButton size="xs" icon="i-lucide:box" aria-label="icon only element" />
      <UIButton size="sm" icon="i-lucide:box" aria-label="icon only element" />
      <UIButton icon="i-lucide:box" aria-label="icon only element" />
      <UIButton size="lg" icon="i-lucide:box" aria-label="icon only element" />
      <UIButton size="xl" icon="i-lucide:box" aria-label="icon only element" />
    </div>
    <h4 class="w-full text-start">
      Tag pair with no slot content
    </h4>
    <div class="w-full flex justify-around items-center">
      <UIButton size="xl" icon="i-lucide:box" aria-label="icon only element"></UIButton>
      <UIButton size="lg" icon="i-lucide:box" aria-label="icon only element"></UIButton>
      <UIButton icon="i-lucide:box" aria-label="icon only element"></UIButton>
      <UIButton size="sm" icon="i-lucide:box" aria-label="icon only element"></UIButton>
      <UIButton size="xs" icon="i-lucide:box" aria-label="icon only element"></UIButton>
    </div>
  </Previewbox>
</template>
