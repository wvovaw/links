<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIDropdownMenu } from "~ui/DropdownMenu";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <UIDropdownMenu.Root>
      <UIDropdownMenu.Trigger as-child>
        <UIButton> Open </UIButton>
      </UIDropdownMenu.Trigger>
      <UIDropdownMenu.Content>
        <UIDropdownMenu.Label class="font-semibold">
          Menu Title
        </UIDropdownMenu.Label>
        <UIDropdownMenu.Separator />
        <UIDropdownMenu.Group>
          <UIDropdownMenu.Label>Group 1</UIDropdownMenu.Label>

          <UIDropdownMenu.Sub>
            <UIDropdownMenu.SubTrigger as-child>
              <UIDropdownMenu.Item>
                <UIDropdownMenu.ItemTitle>Submenu</UIDropdownMenu.ItemTitle>
                <UIDropdownMenu.ItemMeta>
                  <span class="i-lucide:chevron-right" />
                </UIDropdownMenu.ItemMeta>
              </UIDropdownMenu.Item>
            </UIDropdownMenu.SubTrigger>
            <UIDropdownMenu.SubContent>
              <UIDropdownMenu.Item>
                <UIDropdownMenu.ItemTitle>Submenu Item 1</UIDropdownMenu.ItemTitle>
              </UIDropdownMenu.Item>
              <UIDropdownMenu.Item>
                <UIDropdownMenu.ItemTitle>Submenu Item 2</UIDropdownMenu.ItemTitle>
              </UIDropdownMenu.Item>
            </UIDropdownMenu.SubContent>
          </UIDropdownMenu.Sub>
        </UIDropdownMenu.Group>
        <UIDropdownMenu.Separator />
        <UIDropdownMenu.Group>
          <UIDropdownMenu.Label>Group 2</UIDropdownMenu.Label>
          <UIDropdownMenu.Item>
            <UIDropdownMenu.ItemTitle>Item 1</UIDropdownMenu.ItemTitle>
          </UIDropdownMenu.Item>
          <UIDropdownMenu.Item>
            <UIDropdownMenu.ItemTitle>Item 2</UIDropdownMenu.ItemTitle>
          </UIDropdownMenu.Item>
        </UIDropdownMenu.Group>
      </UIDropdownMenu.Content>
    </UIDropdownMenu.Root>
  </PreviewFrame>
</template>
