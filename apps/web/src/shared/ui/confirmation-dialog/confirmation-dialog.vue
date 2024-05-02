<script setup lang="ts">
import { UIButton, UIDialog } from "@links/ui";
import { isVNode } from "vue";
import { useConfirmation } from "./use-confirmation";

const { config, show } = useConfirmation();
</script>

<template>
  <UIDialog.Root :open="show" :modal="true" @update:open="show && config.onCancel()">
    <UIDialog.Content>
      <UIDialog.Header>
        <UIDialog.Title>{{ config.title }}</UIDialog.Title>
        <UIDialog.Subtitle v-if="config.subtitle">
          {{ config.subtitle }}
        </UIDialog.Subtitle>
      </UIDialog.Header>
      <template v-if="isVNode(config.content)">
        <component :is="config.content" />
      </template>
      <template v-else>
        {{ config.content }}
      </template>
      <UIDialog.Footer>
        <UIButton variant="ghost" @click="config.onCancel">
          Cancel
        </UIButton>
        <UIButton @click="config.onConfirm">
          Confirm
        </UIButton>
      </UIDialog.Footer>
    </UIDialog.Content>
  </UIDialog.Root>
</template>
