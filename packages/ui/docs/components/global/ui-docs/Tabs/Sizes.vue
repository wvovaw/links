<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UITabs, UITabsList, UITabsTrigger } from "~ui/Tabs";
</script>

<template>
  <PreviewFrame variant="outline">
    <div class="w-full flex flex-wrap gap-4 justify-around sm:grid sm:grid-cols-3 place-items-center">
      <UITabs default-value="1" as-child>
        <UITabsList size="sm">
          <UITabsTrigger value="1">
            Tab 1
          </UITabsTrigger>
          <UITabsTrigger value="2">
            Tab 2
          </UITabsTrigger>
        </UITabsList>
      </UITabs>

      <UITabs default-value="1" as-child>
        <UITabsList>
          <UITabsTrigger value="1">
            Tab 1
          </UITabsTrigger>
          <UITabsTrigger value="2">
            Tab 2
          </UITabsTrigger>
        </UITabsList>
      </UITabs>

      <UITabs default-value="1" as-child>
        <UITabsList size="lg">
          <UITabsTrigger value="1">
            Tab 1
          </UITabsTrigger>
          <UITabsTrigger value="2">
            Tab 2
          </UITabsTrigger>
        </UITabsList>
      </UITabs>
    </div>
    <div class="w-full flex flex-wrap gap-4 justify-around sm:grid sm:grid-cols-3 place-items-center">
      <UITabs default-value="1" as-child>
        <UITabsList size="sm" variant="tab">
          <UITabsTrigger value="1">
            Tab 1
          </UITabsTrigger>
          <UITabsTrigger value="2">
            Tab 2
          </UITabsTrigger>
        </UITabsList>
      </UITabs>

      <UITabs default-value="1" as-child>
        <UITabsList variant="tab">
          <UITabsTrigger value="1">
            Tab 1
          </UITabsTrigger>
          <UITabsTrigger value="2">
            Tab 2
          </UITabsTrigger>
        </UITabsList>
      </UITabs>

      <UITabs default-value="1" as-child>
        <UITabsList size="lg" variant="tab">
          <UITabsTrigger value="1">
            Tab 1
          </UITabsTrigger>
          <UITabsTrigger value="2">
            Tab 2
          </UITabsTrigger>
        </UITabsList>
      </UITabs>
    </div>
  </PreviewFrame>
</template>
