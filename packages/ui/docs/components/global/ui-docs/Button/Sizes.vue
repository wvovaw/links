<script setup lang="ts">
import PreviewBox from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewBox>
    <h4 class="w-full text-start">
      With no icons
    </h4>
    <div class="w-full flex items-center justify-around">
      <UIButton size="xs">
        XS Button
      </UIButton>
      <UIButton size="sm">
        SM Button
      </UIButton>
      <UIButton>
        MD Button
      </UIButton>
      <UIButton size="lg">
        LG Button
      </UIButton>
      <UIButton size="xl">
        XL Button
      </UIButton>
    </div>
    <h4 class="w-full text-start">
      With icons left
    </h4>
    <div class="w-full flex items-center justify-around">
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
    </div>
    <h4 class="w-full text-start">
      With icons right
    </h4>
    <div class="w-full flex items-center justify-around">
      <UIButton size="xs" icon="i-lucide:box" icon-pos="right">
        XS Button
      </UIButton>
      <UIButton size="sm" icon="i-lucide:box" icon-pos="right">
        SM Button
      </UIButton>
      <UIButton icon="i-lucide:box" icon-pos="right">
        MD Button
      </UIButton>
      <UIButton size="lg" icon="i-lucide:box" icon-pos="right">
        LG Button
      </UIButton>
      <UIButton size="xl" icon="i-lucide:box" icon-pos="right">
        XL Button
      </UIButton>
    </div>
  </Previewbox>
</template>
