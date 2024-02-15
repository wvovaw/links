<script setup lang="ts">
const { locale } = useI18n();
const { data } = await useAsyncData("about", () => queryContent(`_articles/${locale.value}/about`).findOne());

definePageMeta({
  title: "site.pages.about.title",
});
</script>

<template>
  <!-- TODO: Change some prose styles -->
  <!-- TODO: MDC instead of MD, unocss MDC extractor, make MDC document shine -->
  <div class="prose text-fg">
    <ContentRenderer :value="data!">
      <ContentRendererMarkdown :value="data!" />
    </ContentRenderer>
  </div>
</template>
