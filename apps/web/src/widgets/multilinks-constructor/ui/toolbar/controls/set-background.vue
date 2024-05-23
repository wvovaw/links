<script setup lang="ts">
import { UIButton, UISheet, UITooltip } from "@links/ui";
import { BackgroundsList } from "../../backgrounds-list";

const [show, setShow] = useToggle();
</script>

<template>
  <UITooltip attach-side="right">
    <template #trigger>
      <UIButton icon="i-lucide:image" @click="setShow(true)" />
    </template>
    <template #content>
      Set background
    </template>
  </UITooltip>
  <UISheet.Root v-model:open="show">
    <UISheet.Content side="left">
      <UISheet.Header>
        <UISheet.Title>Set Background</UISheet.Title>
        <UISheet.Subtitle>Select one of suggested backgrounds</UISheet.Subtitle>
      </UISheet.Header>
      <BackgroundsList />
    </UISheet.Content>
  </UISheet.Root>
</template>
