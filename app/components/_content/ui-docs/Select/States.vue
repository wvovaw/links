<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UISelect, UISelectHint, UISelectLabel } from "~ui/Select";
</script>

<template>
  <PreviewFrame>
    <div class="w-xs">
      <UISelectLabel for="states-01" size="sm" disabled>
        Small select
      </UISelectLabel>
      <UISelect id="states-01" size="sm" disabled>
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
      <UISelectHint disabled>
        Small select hint message
      </UISelectHint>
    </div>
    <div class="w-xs">
      <UISelectLabel for="states-02">
        Medium select
      </UISelectLabel>
      <UISelect id="states-02" model-value="Some error" error error-message="I am an error">
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
      <UISelectHint error>
        <span class="i-lucide:info" /> An error occured
      </UISelectHint>
    </div>
  </PreviewFrame>
</template>
