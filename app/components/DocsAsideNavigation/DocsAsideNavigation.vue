<script setup lang="ts">
const { locale } = useI18n();
const { data: navigation } = await useAsyncData(`navigation-${locale}`, () => fetchContentNavigation({
  locale: locale.value,
}));
// TODO: Find out how to implement recursive navigation tree
// https://github.com/nuxt-themes/docus/blob/main/components/docs/DocsAsideTree.vue
const links = computed(() => navigation.value[0].children);
</script>

<template>
  <div class="transition-transform -translate-x-full sm:translate-x-0">
    <nav class="overflow-y-auto space-y-8 text-sm">
      <section class="space-y-2">
        <h2 class="text-sm font-semibold tracking-wide uppercase">
          Docs
        </h2>
        <ul class="flex flex-col space-y-2">
          <li v-for="link of links" :key="link._path">
            <NuxtLink
              :to="link._path"
              class="text-sm hover:underline"
            >
              {{ link.title }}
            </NuxtLink>
          </li>
        </ul>
      </section>
    </nav>
  </div>
</template>
