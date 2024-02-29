<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInsertSelect, UISelectHint, UISelectLabel } from "~ui/Select";
</script>

<template>
  <PreviewFrame>
    <div class="w-xs">
      <UIInsertSelect label="Disabled" disabled>
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
      <UISelectHint disabled>
        Small select hint message
      </UISelectHint>
    </div>
    <div class="w-xs">
      <UIInsertSelect label="Error" model-value="Some error" error error-message="I am an error">
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
      <UISelectHint error>
        <span class="i-lucide:info" /> An error occured
      </UISelectHint>
    </div>
  </PreviewFrame>
</template>
