<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInput } from "~ui/Input";
</script>

<template>
  <PreviewFrame>
    <div class="grid grid-cols-3 grid-rows-3 gap-3">
      <UIInput type="number" placeholder="e.g. 12345" />
      <UIInput type="date" />
      <UIInput type="time" />
      <UIInput type="datetime-local" />
      <UIInput type="email" placeholder="johndoe@mail.com" />
      <UIInput type="password" placeholder="password" />
      <UIInput type="search" placeholder="search..." />
      <UIInput type="tel" placeholder="e.g. 7 999 999 99 99" />
      <UIInput type="url" />
    </div>
  </PreviewFrame>
</template>
