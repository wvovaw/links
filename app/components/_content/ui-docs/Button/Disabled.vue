<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <UIButton disabled @click="console.log('lol')">
      Disabled
    </UIButton>
  </PreviewFrame>
</template>
