<script setup lang="ts">
import type { IPage } from "~core/types";
import { PhoneMockup } from "~components/PhoneMockup";
import { PageRenderer } from "~widgets/PageRenderer";

definePageMeta({
  title: "site.pages.create.title",
});

const page: IPage = {
  id: "testpage",
  title: "Some Test Page",
  blocks: [
    {
      id: "1",
      name: "Button",
      properties: [{
        key: "text",
        type: "string",
        label: "Button text",
        defaultValue: "Link",
        value: "Some link",
        required: true,
      }, {
        key: "link",
        type: "url",
        label: "Link",
        value: "#",
        required: true,
      }],
    },
    {
      id: "2",
      name: "Paragraph",
      properties: [{
        key: "text",
        type: "string",
        label: "Paragraph text",
        value: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum commodi voluptatem repudiandae corrupti maiores!",
        required: true
      }],
    },
  ],
};
</script>

<template>
  <div class="grid w-100vw lg:grid-cols-[minmax(320px,320px)_minmax(320px,1fr)_minmax(320px,320px)]">
    <div class="hidden border-r border-beerus lg:block" />
    <div class="mx-auto h-[calc(100vh-var(--navbar-height,64px))] max-w-screen-lg overflow-auto px-1 py-2">
      <PhoneMockup>
        <PageRenderer :page="page" />
      </PhoneMockup>
    </div>
    <div class="hidden border-l border-beerus lg:block" />
  </div>
</template>
