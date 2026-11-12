<script setup lang="ts">
import PreviewBox from "../PreviewFrame.vue";
import { UISwitch } from "~ui/Switch";
</script>

<template>
  <PreviewBox>
    <div class="w-full flex items-center justify-around">
      <UISwitch default-value />
      <UISwitch default-value color="hit" />
      <UISwitch default-value color="chichi" />
      <UISwitch default-value color="krillin" />
      <UISwitch default-value color="roshi" />
    </div>
  </Previewbox>
</template>
