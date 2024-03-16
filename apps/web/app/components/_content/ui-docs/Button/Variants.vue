<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <UIButton>Fill is default</UIButton>
    <UIButton variant="outline">
      Outline
    </UIButton>
    <UIButton variant="ghost">
      Ghost
    </UIButton>
    <UIButton variant="link" as="a" href="#">
      Link
    </UIButton>
  </PreviewFrame>
</template>
