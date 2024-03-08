<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIDropdownMenu } from "~ui/DropdownMenu";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <UIDropdownMenu.Root>
      <UIDropdownMenu.Trigger>
        <UIButton>Open</UIButton>
      </UIDropdownMenu.Trigger>
      <UIDropdownMenu.Content>
        <UIDropdownMenu.Group>
          <UIDropdownMenu.Label>First group</UIDropdownMenu.Label>
          <UIDropdownMenu.Item>Item 1</UIDropdownMenu.Item>
          <UIDropdownMenu.Item>Item 2</UIDropdownMenu.Item>
          <UIDropdownMenu.Item>Item 3</UIDropdownMenu.Item>
        </UIDropdownMenu.Group>
        <UIDropdownMenu.Separator />
        <UIDropdownMenu.Group>
          <UIDropdownMenu.Label>Second group</UIDropdownMenu.Label>
          <UIDropdownMenu.Item>Item 1</UIDropdownMenu.Item>
          <UIDropdownMenu.Item>Item 2</UIDropdownMenu.Item>
        </UIDropdownMenu.Group>
      </UIDropdownMenu.Content>
    </UIDropdownMenu.Root>
  </PreviewFrame>
</template>
