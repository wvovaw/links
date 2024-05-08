<script setup lang="ts">
import NavMenuSection from "./NavMenuSection.vue";
import { UIScrollArea } from "~ui/ScrollArea";

const { data: rootNav } = await useAsyncData(`root-nav`, () => queryContent("docs").where({ _dir: { $not: { $in: ["utilities", "components"] } } }).find());
const { data: componentsNav } = await useAsyncData(`components-nav`, () => queryContent("docs", "components").sort({ title: 1 }).find());
const { data: utilitiesNav } = await useAsyncData(`utilities-nav`, () => queryContent("docs", "utilities").find());
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
