<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInput, UIInputHint, UIInputLabel } from "~ui/Input";
</script>

<template>
  <PreviewFrame>
    <div>
      <UIInputLabel for="states-01" size="sm" disabled>
        Small input
      </UIInputLabel>
      <UIInput id="states-01" size="sm" placeholder="disabled" disabled />
      <UIInputHint disabled>
        Small input hint message
      </UIInputHint>
    </div>
    <div>
      <UIInputLabel for="states-02">
        Medium input
      </UIInputLabel>
      <UIInput id="states-02" model-value="Some error" error error-message="I am an error" placeholder="md (default)" />
      <UIInputHint error>
        <span class="i-lucide:info" /> An error occured
      </UIInputHint>
    </div>
    <div>
      <UIInputLabel for="states-03" size="lg">
        Large input
      </UIInputLabel>
      <UIInput id="states-03" size="lg" model-value="readonly value" read-only placeholder="lg" />
      <UIInputHint>Large input hint message</UIInputHint>
    </div>
  </PreviewFrame>
</template>
