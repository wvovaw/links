<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UISelect } from "~ui/Select";
</script>

<template>
  <PreviewFrame>
    <div class="w-full flex flex-row gap-4">
      <UISelect size="sm">
        <option value="1">
          1
        </option>
        <option value="2">
          2
        </option>
        <option value="3">
          3
        </option>
      </UISelect>
      <UISelect>
        <option value="1">
          1
        </option>
        <option value="2">
          2
        </option>
        <option value="3">
          3
        </option>
      </UISelect>
      <UISelect size="lg">
        <option value="1">
          1
        </option>
        <option value="2">
          2
        </option>
        <option value="3">
          3
        </option>
      </UISelect>
    </div>
  </PreviewFrame>
</template>
