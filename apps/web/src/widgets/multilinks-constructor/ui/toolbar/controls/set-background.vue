<script setup lang="ts">
import { UIButton, UISheet, UITooltip } from "@links/ui";

import { ThemeEditor } from "../../theme-editor";

const [show, setShow] = useToggle();
</script>

<template>
  <UITooltip attach-side="right">
    <template #trigger>
      <UIButton icon="i-lucide:image" @click="setShow(true)" />
    </template>
    <template #content> Page theme </template>
  </UITooltip>
  <UISheet.Root v-model:open="show">
    <UISheet.Content side="left">
      <UISheet.Header>
        <UISheet.Title>Page theme</UISheet.Title>
        <UISheet.Subtitle>Pick a background and tune the page tokens</UISheet.Subtitle>
      </UISheet.Header>
      <ThemeEditor />
    </UISheet.Content>
  </UISheet.Root>
</template>
