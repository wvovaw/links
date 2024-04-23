<script setup lang="ts">
import { MultilinksConstructorPage } from "~pages/multilinks-constructor";

definePageMeta({
  title: "pages.constructor.title",
  middleware: ["authenticated"],
});
</script>

<template>
  <MultilinksConstructorPage />
</template>
