<script setup lang="ts">
import { UIButton, UISheet } from "@links/ui";

const { t } = useI18n();
</script>

<template>
  <UISheet.Root>
    <UISheet.Trigger as-child>
      <UIButton size="sm" icon="i-lucide:plus">{{ t("links.create") }}</UIButton>
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
