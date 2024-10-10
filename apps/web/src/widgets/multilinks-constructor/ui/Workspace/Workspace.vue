<script setup lang="ts">
import { UIScrollArea } from "@links/ui";
import { useConstructorData } from "../../model/provider";
import { LinkNamePreview } from "../link-name-preview";
import PageRenderer from "./PageRenderer.vue";
import { PhoneMockup } from "~shared/ui/PhoneMockup";

const { isMobile } = useConstructorData();
</script>

<template>
  <UIScrollArea bar-class="rounded-none" thumb-class="bg-trunks">
    <div class="grid w-full place-content-center md:py-2">
      <LinkNamePreview />
      <PageRenderer v-if="isMobile" />
      <PhoneMockup v-else>
        <PageRenderer class="rounded-40px" />
      </PhoneMockup>
    </div>
  </UIScrollArea>
</template>
