<script setup lang="ts">
import NavMenuSection from "./NavMenuSection.vue";

const { data: rootNav } = await useAsyncData(`root-nav`, () => queryContent("docs").where({ _dir: { $ne: "components" } }).sort({ title: 1 }).find());
const { data: componentsNav } = await useAsyncData(`components-nav`, () => queryContent("docs", "components").sort({ title: 1 }).find());

// TODO: Find out how to implement recursive navigation tree
// https://github.com/nuxt-themes/docus/blob/main/components/docs/DocsAsideTree.vue
</script>

<template>
  <aside class="sticky top-0 py-6 px-4 border-(r-1 beerus) bg-gohan transition-transform -translate-x-full sm:translate-x-0">
    <nav class="overflow-y-auto">
      <NavMenuSection :links="rootNav" title="index" />
      <NavMenuSection :links="componentsNav" title="components" />
    </nav>
  </aside>
</template>
