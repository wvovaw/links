<script setup lang="ts">
const route = useRoute();
const { data: doc } = await useAsyncData("page-data", () => queryContent(route.path).findOne());
</script>

<template>
  <ContentRenderer data-nuxt-content v-if="doc" :value="doc" class="max-w-full w-full prose" />
</template>
