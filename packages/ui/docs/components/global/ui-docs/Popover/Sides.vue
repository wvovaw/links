<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIPopover, UIPopoverArrow, UIPopoverContent, UIPopoverTrigger } from "~ui/Popover";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <div class="w-full flex flex-row flex-wrap justify-around gap-4">
      <UIPopover>
        <UIPopoverTrigger as-child>
          <UIButton>Left</UIButton>
        </UIPopoverTrigger>
        <UIPopoverContent side="left">
          Left aligned popover
          <UIPopoverArrow />
        </UIPopoverContent>
      </UIPopover>
      <UIPopover>
        <UIPopoverTrigger as-child>
          <UIButton>Top</UIButton>
        </UIPopoverTrigger>
        <UIPopoverContent side="top">
          <div>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi suscipit mollitia praesentium non error voluptas magnam voluptatibus minima illo impedit.
          </div>
          <UIPopoverArrow />
        </UIPopoverContent>
      </UIPopover>
      <UIPopover>
        <UIPopoverTrigger as-child>
          <UIButton>Right</UIButton>
        </UIPopoverTrigger>
        <UIPopoverContent side="right">
          Right aligned popover
          <UIPopoverArrow />
        </UIPopoverContent>
      </UIPopover>
      <UIPopover>
        <UIPopoverTrigger as-child>
          <UIButton>Bottom</UIButton>
        </UIPopoverTrigger>
        <UIPopoverContent side="bottom">
          Bottom aligned popover
          <UIPopoverArrow />
        </UIPopoverContent>
      </UIPopover>
    </div>
  </PreviewFrame>
</template>
