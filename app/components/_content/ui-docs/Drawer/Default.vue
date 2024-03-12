<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIDrawer } from "~ui/Drawer";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <UIDrawer.Root>
      <UIDrawer.Trigger as-child>
        <UIButton>Open</UIButton>
      </UIDrawer.Trigger>
      <UIDrawer.Content>
        <UIDrawer.Header>
          <UIDrawer.Title>Dialog title</UIDrawer.Title>
          <UIDrawer.Subtitle>Dialog subtitle</UIDrawer.Subtitle>
        </UIDrawer.Header>
        Dialog content
        <UIDrawer.Footer>
          <UIDrawer.Close as-child>
            <UIButton>Ok</UIButton>
          </UIDrawer.Close>
        </UIDrawer.Footer>
      </UIDrawer.Content>
    </UIDrawer.Root>
  </PreviewFrame>
</template>
