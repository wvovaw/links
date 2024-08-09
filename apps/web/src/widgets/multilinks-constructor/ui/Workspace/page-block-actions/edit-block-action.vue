<script setup lang="ts">
import { VisuallyHidden } from "radix-vue";
import { UIDrawer } from "@links/ui";
import { BlockPropertiesEditor } from "../../block-properties-editor";
import ActionButton from "./action-button.vue";

defineProps<{
  blockId: string | null;
}>();
</script>

<template>
  <UIDrawer.Root>
    <UIDrawer.Trigger as-child>
      <ActionButton
        icon="i-lucide:pencil"
      />
    </UIDrawer.Trigger>
    <UIDrawer.Content>
      <UIDrawer.Header>
        <UIDrawer.Title>Block Properties</UIDrawer.Title>
        <VisuallyHidden>
          <UIDrawer.Subtitle>Edit block properties</UIDrawer.Subtitle>
        </VisuallyHidden>
      </UIDrawer.Header>
      <BlockPropertiesEditor />
    </UIDrawer.Content>
  </UIDrawer.Root>
</template>
