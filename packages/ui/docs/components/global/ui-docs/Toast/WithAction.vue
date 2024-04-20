<script setup lang="tsx">
import PreviewFrame from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
import { UIToast, useToast } from "~ui/Toast";

const { toast } = useToast();

function handleClick() {
  toast({
    title: "Content deleted",
    content: "Content deleted successfully",
    // eslint-disable-next-line no-alert
    action: h(UIToast.Action, { altText: "Undo", onClick: () => alert("Can't undo deletion") }, { default: () => "Undo" }),
  });
}
</script>

<template>
  <PreviewFrame>
    <UIButton @click="handleClick">
      Show Toast
    </UIButton>
  </PreviewFrame>
</template>
