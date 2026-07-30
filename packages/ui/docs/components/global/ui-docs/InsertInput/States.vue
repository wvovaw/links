<script setup lang="ts">
import { UIInputHint, UIInsertInput } from "~ui/Input";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <div>
      <UIInsertInput label="Disabled" placeholder="Disabled" disabled />
      <UIInputHint disabled> Disabled insert input </UIInputHint>
    </div>
    <div>
      <UIInsertInput
        model-value="Some error"
        error
        immediate-validation
        error-message="I am an error"
        label="Error"
        placeholder="Error"
      />
      <UIInputHint error> <span class="i-lucide:info" /> An error occured </UIInputHint>
    </div>
    <div>
      <UIInsertInput model-value="readonly value" read-only label="Read only" placeholder="Read only" />
      <UIInputHint>Read only insert input</UIInputHint>
    </div>
  </PreviewFrame>
</template>
