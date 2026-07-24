<script setup lang="ts">
import { PreviewPage } from "~pages/preview";

const { params } = useRoute("links-preview-id___en___default");

definePageMeta({
  title: "pages.preview.title",
  layout: false,
  middleware: "auth",
});
</script>

<template>
  <PreviewPage :link-id="params.id" />
</template>
