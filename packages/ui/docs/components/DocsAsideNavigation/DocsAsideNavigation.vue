<script setup lang="ts">
import NavMenuSection from "./NavMenuSection.vue";
import { UIScrollArea } from "~ui/ScrollArea";

const { data: rootNav } = await useAsyncData(`root-nav`, () => queryContent("docs").where({ _dir: { $ne: "components" } }).sort({ title: 1 }).find());
const { data: componentsNav } = await useAsyncData(`components-nav`, () => queryContent("docs", "components").sort({ title: 1 }).find());

// TODO: Find out how to implement recursive navigation tree
// https://github.com/nuxt-themes/docus/blob/main/components/docs/DocsAsideTree.vue
</script>

<template>
  <aside class="sticky top-0 h-100vh border-(r-1 beerus) bg-gohan transition-transform -translate-x-full sm:translate-x-0">
    <UIScrollArea as-child bar-class="bg-transparent py-2" thumb-class="bg-heles!" type="auto">
      <nav class="px-4 py-6">
        <NavMenuSection :links="rootNav" title="index" />
        <NavMenuSection :links="componentsNav" title="components" />
      </nav>
    </UIScrollArea>
  </aside>
</template>
