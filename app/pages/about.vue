<script setup lang="ts">
const { locale } = useI18n();
const { data } = await useAsyncData("about", () => queryContent(`_articles/about.${locale.value}`).findOne());

definePageMeta({
  title: "site.pages.about.title",
});
</script>

<template>
  <div class="prose">
    <ContentRenderer :value="data!">
      <ContentRendererMarkdown :value="data!" />
    </ContentRenderer>
  </div>
</template>
