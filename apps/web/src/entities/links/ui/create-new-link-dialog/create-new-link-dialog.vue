<script setup lang="ts">
import { UIButton, UISheet } from "@links/ui";
</script>

<template>
  <UISheet.Root>
    <UISheet.Trigger as-child>
      <UIButton
        class="w-52!"
        full-width
        icon="i-lucide:plus"
        icon-pos="right"
      >
        Create new link
      </UIButton>
    </UISheet.Trigger>
    <UISheet.Content class="w-full sm:min-w-md sm:w-fit">
      <UISheet.Header>
        <UISheet.Title>New link</UISheet.Title>
        <UISheet.Subtitle>Create new link</UISheet.Subtitle>
      </UISheet.Header>

      <section class="py-4">
        <slot />
      </section>
    </UISheet.Content>
  </UISheet.Root>
</template>
