<script setup lang="ts">
import NavMenuSection from "./NavMenuSection.vue";
import { UIScrollArea } from "~ui/ScrollArea";

const { data: rootNav } = await useAsyncData(`root-nav`, () =>
  queryCollection("content")
    .where("path", "NOT LIKE", "/docs/utilities/%")
    .where("path", "NOT LIKE", "/docs/components/%")
    .order("title", "ASC")
    .all()
);
const { data: componentsNav } = await useAsyncData(`components-nav`, () =>
  queryCollection("content")
    .where("path", "LIKE", "/docs/components/%")
    .order("title", "ASC")
    .all()
);
const { data: utilitiesNav } = await useAsyncData(`utilities-nav`, () =>
  queryCollection("content")
    .where("path", "LIKE", "/docs/utilities/%")
    .order("title", "ASC")
    .all()
);
</script>

<template>
  <aside class="sticky top-0 h-100vh border-(r-1 beerus) bg-gohan transition-transform -translate-x-full sm:translate-x-0">
    <UIScrollArea as-child bar-class="bg-transparent py-2" thumb-class="bg-heles!" type="auto">
      <nav class="px-4 py-6">
        <NavMenuSection :links="rootNav" title="index" />
        <NavMenuSection :links="utilitiesNav" title="utilities" />
        <NavMenuSection :links="componentsNav" title="components" />
      </nav>
    </UIScrollArea>
  </aside>
</template>
