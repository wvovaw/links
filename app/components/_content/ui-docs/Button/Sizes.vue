<script setup lang="ts">
import Previewbox from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
</script>

<template>
  <Previewbox>
    <UIButton size="xs" icon="i-lucide:box">
      XS Button
    </UIButton>
    <UIButton size="sm" icon="i-lucide:box">
      SM Button
    </UIButton>
    <UIButton icon="i-lucide:box">
      MD Button
    </UIButton>
    <UIButton size="lg" icon="i-lucide:box">
      LG Button
    </UIButton>
    <UIButton size="xl" icon="i-lucide:box">
      XL Button
    </UIButton>
  </Previewbox>
</template>
