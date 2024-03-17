<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIDialog } from "~ui/Dialog";
import { UIButton } from "~ui/Button";
import { UIScrollArea } from "~ui/ScrollArea";
</script>

<template>
  <PreviewFrame>
    <UIDialog.Root>
      <UIDialog.Trigger as-child>
        <UIButton>Open</UIButton>
      </UIDialog.Trigger>
      <UIDialog.Content class="max-h-lg w-md">
        <UIDialog.Header>
          <UIDialog.Title>Dialog title</UIDialog.Title>
          <UIDialog.Subtitle>Dialog subtitle</UIDialog.Subtitle>
        </UIDialog.Header>
        <UIScrollArea class="max-h-xs w-full rounded-moon-s-sm" type="auto">
          <img src="https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=1827&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image by George C">
        </UIScrollArea>
        <UIDialog.Footer>
          <UIDialog.Close as-child>
            <UIButton>Ok</UIButton>
          </UIDialog.Close>
        </UIDialog.Footer>
      </UIDialog.Content>
    </UIDialog.Root>
  </PreviewFrame>
</template>
