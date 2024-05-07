<script setup lang="ts">
import { UIButton, UISheet, UITooltip } from "@links/ui";
import { BlocksList } from "../../BlocksList";

const [show, setShow] = useToggle();
</script>

<template>
  <UITooltip attach-side="right">
    <template #trigger>
      <UIButton icon="i-lucide:square-plus" @click="setShow(true)" />
    </template>
    <template #content>
      Add a block
    </template>
  </UITooltip>
  <UISheet.Root v-model:open="show">
    <UISheet.Content side="left">
      <UISheet.Header>
        <UISheet.Title>Add Block</UISheet.Title>
        <UISheet.Subtitle>Select a block to add</UISheet.Subtitle>
      </UISheet.Header>
      <BlocksList @click="setShow(false)" />
    </UISheet.Content>
  </UISheet.Root>
</template>
