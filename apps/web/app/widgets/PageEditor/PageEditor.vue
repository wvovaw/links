<script setup lang="ts">
import { UIScrollArea } from "@links/ui";
import { BlockPropertiesEditor } from "./components/BlockPropertiesEditor";
import { BlocksList } from "./components/BlocksList";
import PageRenderer from "./components/PageRenderer.vue";
import { PhoneMockup } from "~components/PhoneMockup";
</script>

<template>
  <div class="grid h-[calc(100vh-var(--navbar-height,64px))] w-100vw lg:grid-cols-[minmax(320px,320px)_minmax(320px,1fr)_minmax(320px,320px)]">
    <UIScrollArea class="hidden border-r border-beerus lg:block">
      <BlocksList />
    </UIScrollArea>
    <UIScrollArea class="grid w-full max-w-screen-lg place-content-center py-2">
      <PhoneMockup>
        <PageRenderer />
      </PhoneMockup>
    </UIScrollArea>
    <UIScrollArea class="hidden border-l border-beerus lg:block">
      <BlockPropertiesEditor />
    </UIScrollArea>
  </div>
</template>
