<script setup lang="ts">
import { IndexPage } from "~pages/index";

definePageMeta({
  title: "pages.index.title",
  middleware: "auth",
});
</script>

<template>
  <IndexPage />
</template>
