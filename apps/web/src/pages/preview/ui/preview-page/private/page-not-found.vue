<script setup lang="ts">
import { UIButton } from "@links/ui";
</script>

<template>
  <div class="grid h-100vh w-100vw place-content-center">
    <div class="rounded-moon-s-md bg-gohan p-12 space-y-5">
      <div class="text-moon-24">
        Requested page not found
      </div>
      <div class="flex justify-center gap-4">
        <UIButton as-child variant="link">
          <NuxtLinkLocale to="/links">
            <span class="i-lucide:arrow-left" /> &ThickSpace; Back to links list
          </NuxtLinkLocale>
        </UIButton>
      </div>
    </div>
  </div>
</template>
