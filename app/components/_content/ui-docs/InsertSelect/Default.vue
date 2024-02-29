<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInsertSelect } from "~ui/Select";
</script>

<template>
  <PreviewFrame>
    <UIInsertSelect label="Label">
      <option value="1">
        Belarus
      </option>
      <option value="2">
        Ukraine
      </option>
      <option value="3">
        Russia
      </option>
    </UIInsertSelect>
  </PreviewFrame>
</template>
