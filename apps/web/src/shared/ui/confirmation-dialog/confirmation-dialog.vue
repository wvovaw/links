<script setup lang="ts">
import { UIButton, UIDialog, UISheet } from "@links/ui";
import { isVNode } from "vue";
import { useConfirmation } from "./use-confirmation";

const { config, show } = useConfirmation();
const isDesktop = useMediaQuery("(min-width: 640px)");
const [UseTemplate, ContentComp] = createReusableTemplate();

function closeIfOpen() {
  if (show.value)
    config.value.onCancel();
}
</script>

<template>
  <UseTemplate>
    <template v-if="isVNode(config.content)">
      <component :is="config.content" />
    </template>
    <template v-else>
      {{ config.content }}
    </template>
  </UseTemplate>

  <UIDialog.Root v-if="isDesktop" :open="show" @update:open="closeIfOpen">
    <UIDialog.Content>
      <UIDialog.Header>
        <UIDialog.Title>{{ config.title }}</UIDialog.Title>
        <UIDialog.Subtitle v-if="config.subtitle">
          {{ config.subtitle }}
        </UIDialog.Subtitle>
      </UIDialog.Header>
      <div class="py-4">
        <ContentComp />
      </div>
      <UIDialog.Footer class="flex gap-2">
        <UIButton variant="ghost" @click="config.onCancel">
          Cancel
        </UIButton>
        <UIButton @click="config.onConfirm">
          Confirm
        </UIButton>
      </UIDialog.Footer>
    </UIDialog.Content>
  </UIDialog.Root>

  <UISheet.Root v-else :open="show" @update:open="closeIfOpen">
    <UISheet.Content side="bottom">
      <UISheet.Header>
        <UISheet.Title>{{ config.title }}</UISheet.Title>
        <UISheet.Subtitle v-if="config.subtitle">
          {{ config.subtitle }}
        </UISheet.Subtitle>
        <div class="py-4">
          <ContentComp />
        </div>
        <UISheet.Footer class="flex gap-2">
          <UIButton variant="ghost" @click="config.onCancel">
            Cancel
          </UIButton>
          <UIButton @click="config.onConfirm">
            Confirm
          </UIButton>
        </UISheet.Footer>
      </UISheet.Header>
    </UISheet.Content>
  </UISheet.Root>
</template>
