<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UICheckbox } from "~ui/Checkbox";
</script>

<template>
  <PreviewFrame>
    <div class="grid grid-rows-2 w-full place-items-center gap-5">
      <div class="flex flex-row gap-5">
        <UICheckbox id="default" default-checked />
        <UICheckbox id="piccolo" default-checked color="piccolo" />
        <UICheckbox id="hit" default-checked color="hit" />
        <UICheckbox id="chichi" default-checked color="chichi" />
        <UICheckbox id="krillin" default-checked color="krillin" />
        <UICheckbox id="roshi" default-checked color="roshi" />
      </div>
      <div class="flex flex-row gap-5">
        <UICheckbox id="default" default-checked size="md" />
        <UICheckbox id="piccolo" default-checked color="piccolo" size="md" />
        <UICheckbox id="hit" default-checked color="hit" size="md" />
        <UICheckbox id="chichi" default-checked color="chichi" size="md" />
        <UICheckbox id="krillin" default-checked color="krillin" size="md" />
        <UICheckbox id="roshi" default-checked color="roshi" size="md" />
      </div>
    </div>
  </PreviewFrame>
</template>
