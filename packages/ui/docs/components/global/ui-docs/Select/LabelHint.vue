<script setup lang="ts">
import { UISelect, UISelectHint, UISelectLabel } from "~ui/Select";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame class="gap-0!">
    <UISelectLabel for="sel-00"> Select with label </UISelectLabel>
    <UISelect id="sel-00">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </UISelect>
    <UISelectHint>Select with hint</UISelectHint>
  </PreviewFrame>
</template>
