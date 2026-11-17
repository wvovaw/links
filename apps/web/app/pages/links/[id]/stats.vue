<script setup lang="ts">
import { LinkStatsPage } from "~pages/links-stats";

const { params } = useRoute("links-id-stats___en___default");

definePageMeta({
  title: "pages.links.stats.title",
  middleware: "auth",
});
</script>

<template>
  <LinkStatsPage :link-id="params.id" />
</template>
