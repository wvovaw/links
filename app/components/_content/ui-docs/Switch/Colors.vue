<script setup lang="ts">
import PreviewBox from "../PreviewFrame.vue";
import { UISwitch } from "~ui/Switch";
</script>

<template>
  <PreviewBox>
    <div class="w-full flex justify-around items-center">
      <UISwitch />
      <UISwitch color="hit" />
      <UISwitch color="chichi" />
      <UISwitch color="krillin" />
      <UISwitch color="roshi" />
    </div>
  </Previewbox>
</template>
