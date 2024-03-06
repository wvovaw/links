<script setup lang="ts">
import PreviewBox from "../PreviewFrame.vue";
import { UISwitch } from "~ui/Switch";
</script>

<template>
  <PreviewBox>
    <div class="w-full flex justify-around items-center">
      <UISwitch default-checked />
      <UISwitch default-checked color="hit" />
      <UISwitch default-checked color="chichi" />
      <UISwitch default-checked color="krillin" />
      <UISwitch default-checked color="roshi" />
    </div>
  </Previewbox>
</template>
