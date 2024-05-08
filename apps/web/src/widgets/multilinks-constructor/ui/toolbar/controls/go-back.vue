<script setup lang="ts">
import { UIButton, UITooltip } from "@links/ui";
</script>

<template>
  <UITooltip attach-side="right">
    <template #trigger>
      <NuxtLinkLocale to="/links">
        <UIButton icon="i-lucide:log-out rotate-y-180" variant="ghost" color="chichi" as="span" />
      </NuxtLinkLocale>
    </template>
    <template #content>
      Leave constructor
    </template>
  </UITooltip>
</template>
