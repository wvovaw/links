<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIDropdownMenu } from "~ui/DropdownMenu";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <UIDropdownMenu.Root>
      <UIDropdownMenu.Trigger as-child>
        <UIButton>Open</UIButton>
      </UIDropdownMenu.Trigger>
      <UIDropdownMenu.Content>
        <UIDropdownMenu.Group>
          <UIDropdownMenu.Label>
            <span>Actions</span>
          </UIDropdownMenu.Label>
          <UIDropdownMenu.Separator />
          <UIDropdownMenu.Item>
            <span class="block i-lucide:file" />
            <UIDropdownMenu.ItemTitle>New file</UIDropdownMenu.ItemTitle>
            <UIDropdownMenu.ItemMeta><span class="block i-lucide:command" />+N</UIDropdownMenu.ItemMeta>
          </UIDropdownMenu.Item>
          <UIDropdownMenu.Item>
            <span class="block i-lucide:folder" />
            <UIDropdownMenu.ItemTitle>New directory</UIDropdownMenu.ItemTitle>
            <UIDropdownMenu.ItemMeta><span class="block i-lucide:command" />+D</UIDropdownMenu.ItemMeta>
          </UIDropdownMenu.Item>
        </UIDropdownMenu.Group>
      </UIDropdownMenu.Content>
    </UIDropdownMenu.Root>
  </PreviewFrame>
</template>
