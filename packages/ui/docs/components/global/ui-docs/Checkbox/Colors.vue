<script setup lang="ts">
import { UICheckbox } from "~ui/Checkbox";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <div class="grid grid-rows-2 w-full place-items-center gap-5">
      <div class="flex flex-row gap-5">
        <UICheckbox id="default" default-value />
        <UICheckbox id="piccolo" default-value color="piccolo" />
        <UICheckbox id="hit" default-value color="hit" />
        <UICheckbox id="chichi" default-value color="chichi" />
        <UICheckbox id="krillin" default-value color="krillin" />
        <UICheckbox id="roshi" default-value color="roshi" />
      </div>
      <div class="flex flex-row gap-5">
        <UICheckbox id="default" default-value size="md" />
        <UICheckbox id="piccolo" default-value color="piccolo" size="md" />
        <UICheckbox id="hit" default-value color="hit" size="md" />
        <UICheckbox id="chichi" default-value color="chichi" size="md" />
        <UICheckbox id="krillin" default-value color="krillin" size="md" />
        <UICheckbox id="roshi" default-value color="roshi" size="md" />
      </div>
    </div>
  </PreviewFrame>
</template>
