<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="w-full grid place-content-center mt-2 mb-5">
    <div class="flex gap-5 justify-between text-fg font-bold">
      <NuxtLinkLocale
        to="/"
        class="underline-offset-4 hover:underline cursor-pointer"
        active-class="text-primary underline"
      >
        {{ t("site.pages.homepage.linkTitle") }}
      </NuxtLinkLocale>
      &VerticalLine;
      <NuxtLinkLocale
        to="about"
        class="underline-offset-4 hover:underline cursor-pointer"
        active-class="text-primary underline"
      >
        {{ t("site.pages.about.linkTitle") }}
      </NuxtLinkLocale>
    </div>
  </div>
</template>
