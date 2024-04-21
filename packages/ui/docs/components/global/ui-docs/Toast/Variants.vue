<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
import { UIToaster, useToast } from "~ui/Toast";

const { toast } = useToast();
function handleClick() {
  toast({
    title: "Success",
    content: "Success variant",
    variant: "success",
  });
  toast({
    title: "Warning",
    content: "Warning variant",
    variant: "warning",
  });
  toast({
    title: "Error",
    content: "Error variant",
    variant: "error"
  });
}
</script>

<template>
  <PreviewFrame>
    <UIButton @click="handleClick">
      Show Variants
    </UIButton>
  </PreviewFrame>
</template>
