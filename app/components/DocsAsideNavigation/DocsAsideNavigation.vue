<script setup lang="ts">
const { locale } = useI18n();
const { data: navigation } = await useAsyncData(`navigation-${locale}`, () => fetchContentNavigation({
  locale: locale.value,
}));
// TODO: Find out how to implement recursive navigation tree
// https://github.com/nuxt-themes/docus/blob/main/components/docs/DocsAsideTree.vue
const links = computed(() => navigation.value![0].children);
</script>

<template>
  <aside class="sticky top-0 h-100vh p-6 border-(r-1 beerus) bg-gohan transition-transform -translate-x-full sm:translate-x-0">
    <nav class="overflow-y-auto space-y-8 text-moon-16">
      <section class="space-y-2">
        <h2 class="text-moon-18 font-semibold  uppercase">
          Docs
        </h2>
        <ul class="flex flex-col space-y-2">
          <li v-for="link of links" :key="link._path">
            <NuxtLink
              :to="link._path"
              class="text-moon-14 hover:underline"
            >
              {{ link.title }}
            </NuxtLink>
          </li>
        </ul>
      </section>
    </nav>
  </aside>
</template>
