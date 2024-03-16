<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInput, UIInputLabel } from "~ui/Input";
</script>

<template>
  <PreviewFrame>
    <div>
      <UIInputLabel for="labels-01" size="sm" disabled>
        Small input
      </UIInputLabel>
      <UIInput id="labels-01" size="sm" placeholder="sm" disabled />
    </div>
    <div>
      <UIInputLabel for="labels-02">
        Medium input
      </UIInputLabel>
      <UIInput id="labels-02" placeholder="md (default)" />
    </div>
    <div>
      <UIInputLabel for="labels-03" size="lg">
        Large input
      </UIInputLabel>
      <UIInput id="labels-03" size="lg" placeholder="lg" />
    </div>
  </PreviewFrame>
</template>
