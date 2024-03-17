<script setup lang="ts">
import PreviewBox from "../PreviewFrame.vue";
import { UISwitch } from "~ui/Switch";
</script>

<template>
  <PreviewBox>
    <div class="w-full flex items-center justify-around">
      <UISwitch size="xs" />
      <UISwitch size="sm" />
      <UISwitch />
    </div>
  </Previewbox>
</template>
