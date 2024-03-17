<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInsertInput } from "~ui/Input";
</script>

<template>
  <PreviewFrame>
    <div class="flex flex-col sm:grid grid-cols-3 grid-rows-3 gap-3">
      <UIInsertInput label="Number" type="number" placeholder="e.g. 12345" />
      <UIInsertInput label="Date" type="date" />
      <UIInsertInput label="Time" type="time" />
      <UIInsertInput label="Date-Time" type="datetime-local" />
      <UIInsertInput label="Email" type="email" placeholder="johndoe@mail.com" />
      <UIInsertInput label="Password" type="password" placeholder="password" />
      <UIInsertInput label="Search" type="search" placeholder="search..." />
      <UIInsertInput label="Tel" type="tel" placeholder="e.g. 7 999 999 99 99" />
      <UIInsertInput label="URL" type="url" placeholder="https://ya.ru" />
    </div>
  </PreviewFrame>
</template>
