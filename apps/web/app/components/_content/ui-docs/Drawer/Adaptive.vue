<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIDrawer } from "~ui/Drawer";
import { UIDialog } from "~ui/Dialog";
import { UIButton } from "~ui/Button";

const [UseTemplate, ContentComp] = createReusableTemplate();
const isDesktop = useMediaQuery("(min-width: 768px)");
const isOpen = ref(false);
</script>

<template>
  <UseTemplate>
    <div>
      Some generic content
    </div>
  </UseTemplate>

  <PreviewFrame>
    <UIDialog.Root v-if="isDesktop" v-model:open="isOpen">
      <UIDialog.Trigger as-child>
        <UIButton>Open</UIButton>
      </UIDialog.Trigger>
      <UIDialog.Content class="w-md">
        <UIDialog.Header>
          <UIDialog.Title>Dialog title</UIDialog.Title>
          <UIDialog.Subtitle>Dialog subtitle</UIDialog.Subtitle>
        </UIDialog.Header>

        <ContentComp />

        <UIDialog.Footer>
          <UIDialog.Close as-child>
            <UIButton>Ok</UIButton>
          </UIDialog.Close>
        </UIDialog.Footer>
      </UIDialog.Content>
    </UIDialog.Root>

    <UIDrawer.Root v-else v-model:open="isOpen">
      <UIDrawer.Trigger as-child>
        <UIButton>Open</UIButton>
      </UIDrawer.Trigger>
      <UIDrawer.Content>
        <UIDrawer.Header>
          <UIDrawer.Title>Dialog title</UIDrawer.Title>
          <UIDrawer.Subtitle>Dialog subtitle</UIDrawer.Subtitle>
        </UIDrawer.Header>

        <ContentComp />
        <UIDrawer.Footer>
          <UIDrawer.Close as-child>
            <UIButton>Ok</UIButton>
          </UIDrawer.Close>
        </UIDrawer.Footer>
      </UIDrawer.Content>
    </UIDrawer.Root>
  </PreviewFrame>
</template>
