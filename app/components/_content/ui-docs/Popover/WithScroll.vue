<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIPopover, UIPopoverArrow, UIPopoverContent, UIPopoverTrigger } from "~ui/Popover";
import { UIScrollArea } from "~ui/ScrollArea";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <UIPopover>
      <UIPopoverTrigger as-child>
        <UIButton>Click me</UIButton>
      </UIPopoverTrigger>
      <UIPopoverContent>
        <UIScrollArea class="h-32 pr-4">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Suscipit hic eum ratione consequuntur sequi magni enim possimus recusandae totam dolores nulla dolorem maiores optio, quae vero illum quis ea placeat eos soluta corporis! Error ipsum sequi sapiente? Similique est, odio quisquam nisi ratione dolores at adipisci explicabo nam sapiente autem.
        </UIScrollArea>
        <UIPopoverArrow />
      </UIPopoverContent>
    </UIPopover>
  </PreviewFrame>
</template>
