<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="grid mb-5 mt-2 w-full place-content-center">
    <div class="text-fg flex justify-between gap-5 font-bold">
      <NuxtLinkLocale
        to="/"
        class="cursor-pointer underline-offset-4 hover:underline"
        active-class="text-primary underline"
      >
        {{ t("site.pages.homepage.linkTitle") }}
      </NuxtLinkLocale>
      &VerticalLine;
      <NuxtLinkLocale
        to="about"
        class="cursor-pointer underline-offset-4 hover:underline"
        active-class="text-primary underline"
      >
        {{ t("site.pages.about.linkTitle") }}
      </NuxtLinkLocale>
    </div>
  </div>
</template>
