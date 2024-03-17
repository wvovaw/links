<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIMenu } from "~ui/Menu";
import { UISeparator } from "~ui/Separator";

const sel = ref(["2"]);
</script>

<template>
  <PreviewFrame variant="outline">
    <div class="w-full flex flex-wrap justify-around gap-4">
      <div class="w-xs rounded-moon-s-sm bg-gohan p-2 shadow-moon-sm">
        <UIMenu.Item>
          <UIMenu.Icon icon="i-lucide:frame" />
          <UIMenu.Multiline title="Hello world" subtitle="here goes some long subtitle text" />
        </UIMenu.Item>
        <UIMenu.Item>
          <UIMenu.Icon icon="i-lucide:frame" />
          <UIMenu.Multiline title="Hello world" subtitle="here goes some long subtitle text" />
        </UIMenu.Item>
        <UISeparator class="my-1" />
        <UIMenu.Item>
          <UIMenu.Icon icon="i-lucide:frame" />
          <UIMenu.Multiline title="Hello world" subtitle="here goes some long subtitle text" />
        </UIMenu.Item>
      </div>
      <div class="w-xs rounded-moon-s-sm bg-gohan p-2 shadow-moon-sm">
        <UIMenu.Group v-model="sel" type="multiple">
          <UIMenu.GroupItem value="1">
            <div class="h-10 w-10 flex items-center justify-center rounded-moon-i-sm bg-jiren">
              <span class="i-lucide:brain text-moon-20 text-piccolo" />
            </div>
            <UIMenu.Multiline title="Hello world" subtitle="here goes some long subtitle text" />
            <UIMenu.Checkbox />
          </UIMenu.GroupItem>
          <UIMenu.GroupItem value="2">
            <div class="h-10 w-10 flex items-center justify-center rounded-moon-i-sm bg-jira">
              <span class="i-lucide:bone text-moon-20 text-hit" />
            </div>
            <UIMenu.Multiline title="Hello world" subtitle="here goes some long subtitle text" />
            <UIMenu.Checkbox />
          </UIMenu.GroupItem>
          <UIMenu.GroupItem value="3">
            <div class="h-10 w-10 flex items-center justify-center rounded-moon-i-sm bg-chichi-10">
              <span class="i-lucide:rocket text-moon-20 text-chichi" />
            </div>
            <UIMenu.Multiline title="Hello world" subtitle="here goes some long subtitle text" />
            <UIMenu.Checkbox />
          </UIMenu.GroupItem>
        </UIMenu.Group>
      </div>
    </div>
  </PreviewFrame>
</template>
