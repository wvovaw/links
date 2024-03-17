<script setup lang="ts">
import PreviewBox from "../PreviewFrame.vue";
import { UISwitch } from "~ui/Switch";
</script>

<template>
  <PreviewBox>
    <div class="w-full flex justify-around items-center">
      <UISwitch size="xs" />
      <UISwitch size="sm" />
      <UISwitch />
    </div>
  </Previewbox>
</template>
