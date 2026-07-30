<script setup lang="ts">
import { UIButton } from "~ui/Button";
import { UIDialog } from "~ui/Dialog";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <UIDialog.Root>
      <UIDialog.Trigger as-child>
        <UIButton>Open</UIButton>
      </UIDialog.Trigger>
      <UIDialog.Content class="w-md">
        <UIDialog.Header>
          <UIDialog.Title>Dialog title</UIDialog.Title>
          <UIDialog.Subtitle>Dialog subtitle</UIDialog.Subtitle>
        </UIDialog.Header>
        Dialog content
        <UIDialog.Footer>
          <UIDialog.Close as-child>
            <UIButton>Ok</UIButton>
          </UIDialog.Close>
        </UIDialog.Footer>
      </UIDialog.Content>
    </UIDialog.Root>
  </PreviewFrame>
</template>
