<script setup lang="ts">
import { UIButton, UITooltip } from "@links/ui";

import { useConstructorStore } from "../../../model";

const { linkId } = storeToRefs(useConstructorStore());
</script>

<template>
  <UITooltip attach-side="right">
    <template #trigger>
      <NuxtLinkLocale :to="{ name: 'links-id-stats', params: { id: linkId } }">
        <UIButton icon="i-lucide:chart-no-axes-column" variant="ghost" as="span" />
      </NuxtLinkLocale>
    </template>
    <template #content> Statistics </template>
  </UITooltip>
</template>
