<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UITabs, UITabsList, UITabsTrigger } from "~ui/Tabs";
</script>

<template>
  <PreviewFrame variant="outline">
    <div class="w-full flex justify-around">
      <UITabs default-value="1" as-child>
        <UITabsList variant="tab">
          <UITabsTrigger value="1">
            Tab
          </UITabsTrigger>
          <UITabsTrigger value="2">
            Variant
          </UITabsTrigger>
        </UITabsList>
      </UITabs>

      <UITabs default-value="1" as-child>
        <UITabsList variant="pill">
          <UITabsTrigger value="1">
            Pill
          </UITabsTrigger>
          <UITabsTrigger value="2">
            Variant
          </UITabsTrigger>
        </UITabsList>
      </UITabs>
    </div>
  </PreviewFrame>
</template>
