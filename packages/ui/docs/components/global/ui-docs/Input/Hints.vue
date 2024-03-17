<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInput, UIInputHint, UIInputLabel } from "~ui/Input";
</script>

<template>
  <PreviewFrame>
    <div>
      <UIInputLabel for="hints-01" size="sm">
        Small input
      </UIInputLabel>
      <UIInput id="hints-01" size="sm" placeholder="sm" />
      <UIInputHint>Small input hint message</UIInputHint>
    </div>
    <div>
      <UIInputLabel for="hints-02">
        Medium input
      </UIInputLabel>
      <UIInput id="hints-02" placeholder="md (default)" />
      <UIInputHint>Medium input hint message</UIInputHint>
    </div>
    <div>
      <UIInputLabel for="hints-03" size="lg">
        Large input
      </UIInputLabel>
      <UIInput id="hints-03" size="lg" placeholder="lg" />
      <UIInputHint>Large input hint message</UIInputHint>
    </div>
  </PreviewFrame>
</template>
