<script setup lang="ts">
const route = useRoute();
const { data: doc } = await useAsyncData("page-data", () => queryContent(route.path).findOne());
</script>

<template>
  <ContentRenderer v-if="doc" data-nuxt-content :value="doc" class="max-w-full w-full prose" />
</template>
