<script setup lang="ts">
import { UIScrollArea } from "@links/ui";
</script>

<template>
  <UIScrollArea bar-class="rounded-none" thumb-class="bg-trunks">
    <h3 class="ml-3 mt-3 text-moon-18 font-semibold">
      <slot name="title" />
    </h3>
    <slot />
  </UIScrollArea>
</template>
