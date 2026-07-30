<script setup lang="ts">
import { UIInsertSelect } from "~ui/Select";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <UIInsertSelect label="Label">
      <option value="1">Belarus</option>
      <option value="2">Ukraine</option>
      <option value="3">Russia</option>
    </UIInsertSelect>
  </PreviewFrame>
</template>
