<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UITabs, UITabsContent, UITabsList, UITabsTrigger } from "~ui/Tabs";
</script>

<template>
  <PreviewFrame variant="outline">
    <div class="w-full flex flex-wrap justify-around gap-4">
      <UITabs default-value="2">
        <UITabsList variant="tab">
          <UITabsTrigger value="1">
            Tab 1
          </UITabsTrigger>
          <UITabsTrigger value="2" disabled>
            Tab 2
          </UITabsTrigger>
          <UITabsTrigger value="3">
            Tab 3
          </UITabsTrigger>
        </UITabsList>
        <UITabsContent value="1">
          Content 1
        </UITabsContent>
        <UITabsContent value="2">
          Content 2
        </UITabsContent>
        <UITabsContent value="3">
          Content 3
        </UITabsContent>
      </UITabs>

      <UITabs default-value="1">
        <UITabsList variant="pill">
          <UITabsTrigger value="1">
            Tab 1
          </UITabsTrigger>
          <UITabsTrigger value="2" disabled>
            Tab 2
          </UITabsTrigger>
          <UITabsTrigger value="3">
            Tab 3
          </UITabsTrigger>
        </UITabsList>
        <UITabsContent value="1">
          Content 1
        </UITabsContent>
        <UITabsContent value="2">
          Content 2
        </UITabsContent>
        <UITabsContent value="3">
          Content 3
        </UITabsContent>
      </UITabs>
    </div>
  </PreviewFrame>
</template>
