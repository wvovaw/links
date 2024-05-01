<script setup lang="ts">
import { UICard, UISkeleton } from "@links/ui";
</script>

<template>
  <UICard.Root>
    <UICard.Header>
      <UICard.Title>
        <div class="h-24px w-full flex flex-row gap-3">
          <UISkeleton class="h-full w-14" />
          <UISkeleton class="h-full w-24" />
        </div>
      </UICard.Title>
    </UICard.Header>
    <UICard.Body>
      <div>
        <section class="flex flex-col-reverse gap-4 sm:flex-row sm:gap-8">
          <div class="flex-1">
            <div class="mb-8px">
              <div class="mb-8px h-23px w-full flex flex-row place-items-center gap-2">
                <UISkeleton class="h-18px w-8" />
                <UISkeleton class="h-18px w-14" />
                <UISkeleton class="h-18px w-10" />
              </div>
              <UISkeleton class="h-40px w-full" />
            </div>
            <div class="mb-8px">
              <div class="mb-8px h-23px w-full flex flex-row place-items-center gap-2">
                <UISkeleton class="h-18px w-8" />
                <UISkeleton class="h-18px w-14" />
                <UISkeleton class="h-18px w-10" />
              </div>
              <UISkeleton class="h-40px w-full" />
            </div>
          </div>
          <div class="flex flex-col place-content-center items-center sm:min-w-48">
            <div class="mb-8px h-24px w-full flex flex-row place-content-center gap-2">
              <UISkeleton class="h-18px w-8" />
              <UISkeleton class="h-18px w-8" />
            </div>
            <UISkeleton class="mb-8px aspect-1/1 h-144px md:h-192px rounded-full!" />
            <div class="h-48px py-12px">
              <UISkeleton class="h-full w-18" />
            </div>
          </div>
        </section>
      </div>
    </UICard.Body>
    <UICard.Footer class="flex gap-2">
      <UISkeleton class="h-40px w-63px" />
      <UISkeleton class="h-40px w-63px" />
    </UICard.Footer>
  </UICard.Root>
</template>
