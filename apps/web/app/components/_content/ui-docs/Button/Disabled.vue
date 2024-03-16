<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <UIButton disabled>
      Disabled
    </UIButton>
    <UIButton variant="outline" disabled>
      Disabled outline
    </UIButton>
    <UIButton variant="ghost" disabled>
      Disabled ghost
    </UIButton>
    <UIButton variant="link" disabled>
      Disabled link
    </UIButton>
  </PreviewFrame>
</template>
