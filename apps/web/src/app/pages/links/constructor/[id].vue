<script setup lang="ts">
import { LinksConstructorPage } from "~pages/links";

const { params } = useRoute("links-constructor-id___en___default");

definePageMeta({
  title: "pages.links.constructor.title",
});
</script>

<template>
  <LinksConstructorPage :link-id="params.id" />
</template>
