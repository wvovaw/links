<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UICheckbox } from "~ui/Checkbox";
</script>

<template>
  <PreviewFrame>
    <div class="w-full grid grid-rows-2 gap-5 place-items-center">
      <div class="flex flex-row gap-5">
        <UICheckbox id="default" />
        <UICheckbox id="piccolo" color="piccolo" />
        <UICheckbox id="hit" color="hit" />
        <UICheckbox id="chichi" color="chichi" />
        <UICheckbox id="krillin" color="krillin" />
        <UICheckbox id="roshi" color="roshi" />
      </div>
      <div class="flex flex-row gap-5">
        <UICheckbox id="default" size="md" />
        <UICheckbox id="piccolo" color="piccolo" size="md" />
        <UICheckbox id="hit" color="hit" size="md" />
        <UICheckbox id="chichi" color="chichi" size="md" />
        <UICheckbox id="krillin" color="krillin" size="md" />
        <UICheckbox id="roshi" color="roshi" size="md" />
      </div>
    </div>
  </PreviewFrame>
</template>
