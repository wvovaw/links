<script setup lang="ts">
import { LinkPage } from "~pages/[link]";

const route = useRoute("link___en___default");
const { link } = route.params;

definePageMeta({
  layout: false,
});
</script>

<template>
  <LinkPage :link="link" />
</template>
