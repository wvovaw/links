<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInsertSelect, UISelectHint, UISelectLabel } from "~ui/Select";
</script>

<template>
  <PreviewFrame class="gap-0!">
    <UISelectLabel for="sel-00">
      InsertSelect with outer label
    </UISelectLabel>
    <UIInsertSelect id="sel-00" label="Label">
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
    <UISelectHint>InsertSelect with hint</UISelectHint>
  </PreviewFrame>
</template>
