<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UICheckbox } from "~ui/Checkbox";
</script>

<template>
  <PreviewFrame>
    <span class="flex items-center space-x-2">
      <UICheckbox id="disabled-checkbox-00" class="peer" disabled />
      <label for="disabled-checkbox-00" class="peer-disabled:text-trunks">Disabled</label>
    </span>
    <span class="flex items-center space-x-2">
      <UICheckbox id="disabled-checkbox-01" class="peer" default-checked disabled />
      <label for="disabled-checkbox-00" class="peer-disabled:text-trunks">Disabled checked</label>
    </span>
    <span class="flex items-center space-x-2">
      <UICheckbox id="disabled-checkbox-01" class="peer" checked="indeterminate" disabled />
      <label for="disabled-checkbox-00" class="peer-disabled:text-trunks">Disabled indeterminate</label>
    </span>
  </PreviewFrame>
</template>
