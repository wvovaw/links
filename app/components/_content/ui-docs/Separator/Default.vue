<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UISeparator } from "~ui/Separator";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <div class="w-full max-w-[300px] mx-[15px] text-bulma">
      <div class="font-semibold">
        Radix Primitives
      </div>
      <span class="text-trunks"> An open-source UI component library. </span>
      <UISeparator class="bg-heles my-[15px]" />
      <div class="flex h-5 items-center">
        <UIButton as="a" variant="link" href="https://www.radix-vue.com/" target="_blank">
          Blog
        </UIButton>
        <UISeparator class="bg-heles mx-[15px]" decorative orientation="vertical" />
        <UIButton as="a" variant="link" href="https://www.radix-vue.com/" target="_blank">
          Docs
        </UIButton>
        <UISeparator class="bg-heles mx-[15px]" decorative orientation="vertical" />
        <UIButton as="a" variant="link" href="https://www.radix-vue.com/" target="_blank">
          Docs
        </UIButton>
      </div>
    </div>
  </PreviewFrame>
</template>
