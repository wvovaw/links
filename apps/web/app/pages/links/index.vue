<script setup lang="ts">
import { LinksListPage } from "~pages/links";

definePageMeta({
  title: "pages.links.index.title",
  middleware: "auth",
});
</script>

<template>
  <LinksListPage />
</template>
