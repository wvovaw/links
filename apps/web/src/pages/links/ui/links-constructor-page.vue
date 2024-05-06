<script setup lang="ts">
import { UIButton } from "@links/ui";
import { MultilinksConstructor } from "~widgets/multilinks-constructor";

const { params } = useRoute("links-constructor-id___en___default");
</script>

<template>
  <NuxtErrorBoundary>
    <Suspense>
      <MultilinksConstructor :link-id="params.id" />

      <template #fallback>
        <span class="i-lucide:loader-circle mx-auto my-auto h-32 w-32 animate-spin text-trunks" />
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
