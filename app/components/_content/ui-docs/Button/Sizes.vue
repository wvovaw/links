<script setup lang="ts">
import Previewbox from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
</script>

<template>
  <Previewbox>
    <UIButton size="xs">
      <template #iconLeft>
        <span class="i-lucide-box" />
      </template>
      XS Button
    </UIButton>
    <UIButton size="sm">
      <template #iconLeft>
        <span class="i-lucide-box" />
      </template>
      SM Button
    </UIButton>
    <UIButton>
      <template #iconLeft>
        <span class="i-lucide-box" />
      </template>
      MD Button
    </UIButton>
    <UIButton size="lg">
      <template #iconLeft>
        <span class="i-lucide-box" />
      </template>
      LG Button
    </UIButton>
    <UIButton size="xl">
      <template #iconLeft>
        <span class="i-lucide-box" />
      </template>
      XL Button
    </UIButton>
  </Previewbox>
</template>
