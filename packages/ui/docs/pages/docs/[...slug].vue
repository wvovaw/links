<script setup lang="ts">
const route = useRoute();
const { data: doc } = await useAsyncData(`page-${route.path}`, () =>
  queryCollection("content").path(route.path).first()
);
</script>

<template>
  <ContentRenderer v-if="doc" :value="doc" class="max-w-full w-full prose" />
</template>
