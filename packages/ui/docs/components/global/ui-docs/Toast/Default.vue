<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
import { useToast } from "~ui/Toast";

const { toast } = useToast();
function handleClick() {
  toast({
    title: "Scheduled: Catch up",
    content: new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeStyle: "long",
    }).format(new Date()),
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
