<script setup lang="ts">
import { MultilinksConstructor } from "~widgets/multilinks-constructor";

const { params } = useRoute("links-constructor-id___en___default");
</script>

<template>
  <Suspense>
    <MultilinksConstructor :link-id="params.id" />

    <template #fallback>
      <span class="i-lucide:loader mx-auto my-auto h-32 w-32 animate-spin text-hit" />
    </template>
  </Suspense>
</template>
