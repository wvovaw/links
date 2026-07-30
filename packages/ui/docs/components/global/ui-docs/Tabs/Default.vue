<script setup lang="ts">
import { UITabs, UITabsContent, UITabsList, UITabsTrigger } from "~ui/Tabs";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame variant="outline">
    <UITabs default-value="1" as-child>
      <UITabsList>
        <UITabsTrigger value="1"> Tab 1 </UITabsTrigger>
        <UITabsTrigger value="2"> Tab 2 </UITabsTrigger>
      </UITabsList>
      <UITabsContent value="1">
        lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
        lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
        lorem ipsum lorem ipsum lorem ipsum lorem ipsum
      </UITabsContent>
      <UITabsContent value="2">
        lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
        lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
        lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
        lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
      </UITabsContent>
    </UITabs>
  </PreviewFrame>
</template>
