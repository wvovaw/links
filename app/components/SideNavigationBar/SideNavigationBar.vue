<script setup lang="ts">
const { locale } = useI18n();
const { data: navigation } = await useAsyncData("navigation", () => fetchContentNavigation({
  locale: locale.value,
}));
</script>

<template>
  <aside class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
    <nav class="h-full p-6 overflow-y-auto space-y-8 text-sm text-fg bg-fg/10">
      <section class="space-y-2">
        <h2 class="text-sm font-semibold tracki uppercase text-fg/50">
          Docs
        </h2>
        <ul class="flex flex-col space-y-1">
          <!-- TODO: Find out how to implement a simple navigation -->
          <li v-for="link of navigation" :key="link._path">
            <NuxtLink
              :to="link._path"
            >
              {{ link.title }}
            </NuxtLink>
          </li>
        </ul>
      </section>
    </nav>
  </aside>
</template>
