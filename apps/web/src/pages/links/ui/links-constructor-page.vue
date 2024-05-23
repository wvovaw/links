<script setup lang="ts">
import { UIButton } from "@links/ui";
import { LoadingSpinner } from "~shared/ui/loading-spinner";
import { MultilinksConstructor } from "~widgets/multilinks-constructor";

defineProps<{
  linkId: string;
}>();
</script>

<template>
  <NuxtErrorBoundary>
    <Suspense>
      <MultilinksConstructor :link-id="linkId" />
      <template #fallback>
        <LoadingSpinner class="mx-auto my-auto h-28 w-28 text-trunks" />
      </template>
    </Suspense>
    <template #error="{ error }">
      <div class="mx-auto my-auto flex flex-col items-center gap-4 text-center">
        <p class="text-moon-16 sm:text-moon-24">
          {{ error }}
        </p>
        <NuxtLinkLocale to="/links">
          <UIButton icon="i-lucide:corner-up-left" as="span">
            Go To My Links
          </UIButton>
        </NuxtLinkLocale>
      </div>
    </template>
  </NuxtErrorBoundary>
</template>
