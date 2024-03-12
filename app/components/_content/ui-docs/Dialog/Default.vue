<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIDialog } from "~ui/Dialog";
import { UIButton } from "~ui/Button";
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
