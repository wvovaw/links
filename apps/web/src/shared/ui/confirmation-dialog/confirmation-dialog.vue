<script setup lang="ts">
import { UIButton, UIDialog } from "@links/ui";
import { useConfirmation } from "./use-confirmation";

const { config, show } = useConfirmation();
</script>

<template>
  <UIDialog.Root v-model:open="show" :modal="true">
    <UIDialog.Content>
      <UIDialog.Header>
        <UIDialog.Title>{{ config.title }}</UIDialog.Title>
        <UIDialog.Subtitle v-if="config.subtitle">
          {{ config.subtitle }}
        </UIDialog.Subtitle>
      </UIDialog.Header>
      <slot>
        {{ config.content }}
      </slot>
      <UIDialog.Footer>
        <UIButton @click="config.onConfirm">
          Confirm
        </UIButton>
        <UIButton variant="ghost" @click="config.onCancel">
          Cancel
        </UIButton>
      </UIDialog.Footer>
    </UIDialog.Content>
  </UIDialog.Root>
</template>
