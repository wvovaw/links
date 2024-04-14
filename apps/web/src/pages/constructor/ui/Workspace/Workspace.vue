<script setup lang="ts">
import PageRenderer from "./PageRenderer.vue";
import { PhoneMockup } from "~shared/ui/PhoneMockup";
</script>

<template>
  <div class="grid w-full max-w-screen-lg place-content-center py-2">
    <PhoneMockup>
      <PageRenderer />
    </PhoneMockup>
  </div>
</template>
