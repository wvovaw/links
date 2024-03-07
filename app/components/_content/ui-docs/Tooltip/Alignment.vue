<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
import { UITooltip } from "~ui/Tooltip";
</script>

<template>
  <PreviewFrame>
    <div class="grid grid-cols-3 grid-rows-3 gap-4">
      <UITooltip arrow-align="start" attach-side="top">
        <template #trigger>
          <UIButton>Top Left</UIButton>
        </template>
        <template #content>
          Top Left
        </template>
      </UITooltip>

      <UITooltip arrow-align="center" attach-side="top">
        <template #trigger>
          <UIButton>Top Center</UIButton>
        </template>
        <template #content>
          Top Center
        </template>
      </UITooltip>

      <UITooltip arrow-align="end" attach-side="top">
        <template #trigger>
          <UIButton>Top Right</UIButton>
        </template>
        <template #content>
          Top Right
        </template>
      </UITooltip>

      <UITooltip arrow-align="start" attach-side="bottom">
        <template #trigger>
          <UIButton>Bottom Left</UIButton>
        </template>
        <template #content>
          Bottom Left
        </template>
      </UITooltip>

      <UITooltip arrow-align="center" attach-side="bottom">
        <template #trigger>
          <UIButton>Bottom Center</UIButton>
        </template>
        <template #content>
          Bottom Center
        </template>
      </UITooltip>

      <UITooltip arrow-align="end" attach-side="bottom">
        <template #trigger>
          <UIButton>Bottom Right</UIButton>
        </template>
        <template #content>
          Bottom Right
        </template>
      </UITooltip>

      <UITooltip attach-side="left">
        <template #trigger>
          <UIButton>Left</UIButton>
        </template>
        <template #content>
          Left
        </template>
      </UITooltip>

      <UITooltip attach-side="right">
        <template #trigger>
          <UIButton>Right</UIButton>
        </template>
        <template #content>
          Right
        </template>
      </UITooltip>
    </div>
  </PreviewFrame>
</template>
