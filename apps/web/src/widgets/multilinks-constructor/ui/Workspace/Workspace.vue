<script setup lang="ts">
import { UIScrollArea } from "@links/ui";
import PageRenderer from "./PageRenderer.vue";
import { PhoneMockup } from "~shared/ui/PhoneMockup";
</script>

<template>
  <UIScrollArea bar-class="rounded-none" thumb-class="bg-trunks">
    <div class="grid w-full place-content-center py-2">
      <PhoneMockup>
        <PageRenderer />
      </PhoneMockup>
    </div>
  </UIScrollArea>
</template>
