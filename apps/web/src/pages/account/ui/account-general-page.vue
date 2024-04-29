<script setup lang="ts">
import { UIProgressCircular } from "@links/ui";
import { ProfileSettingsForm } from "~features/user";
</script>

<template>
  <Suspense>
    <ProfileSettingsForm />
    <template #fallback>
      <UIProgressCircular size="xl" :model-value="null" />
    </template>
  </Suspense>
</template>
