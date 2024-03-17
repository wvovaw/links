<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInputHint, UIInputLabel, UIInsertInput } from "~ui/Input";
</script>

<template>
  <PreviewFrame>
    <div>
      <UIInputLabel for="hints-01">
        Outer label
      </UIInputLabel>
      <UIInsertInput id="hints-01" label="Inner label" placeholder="Placeholder" />
      <UIInputHint>Hint message</UIInputHint>
    </div>
  </PreviewFrame>
</template>
