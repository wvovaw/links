<script setup lang="ts">
import { UIButton } from "~ui/Button";
import { UISeparator } from "~ui/Separator";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <div class="mx-[15px] max-w-[300px] w-full text-bulma">
      <div class="font-semibold">Reka UI Primitives</div>
      <span class="text-trunks"> An open-source UI component library. </span>
      <UISeparator class="my-[15px] bg-heles" />
      <div class="h-5 flex items-center">
        <UIButton as="a" variant="link" href="https://reka-ui.com/" target="_blank"> Blog </UIButton>
        <UISeparator class="mx-[15px] bg-heles" decorative orientation="vertical" />
        <UIButton as="a" variant="link" href="https://reka-ui.com/" target="_blank"> Docs </UIButton>
        <UISeparator class="mx-[15px] bg-heles" decorative orientation="vertical" />
        <UIButton as="a" variant="link" href="https://reka-ui.com/" target="_blank"> Docs </UIButton>
      </div>
    </div>
  </PreviewFrame>
</template>
