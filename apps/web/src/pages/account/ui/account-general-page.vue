<script setup lang="ts">
import { ProfileSettingsForm, ProfileSettingsFormSkeleton } from "~features/user";
</script>

<template>
  <Suspense>
    <ProfileSettingsForm />
    <template #fallback>
      <ProfileSettingsFormSkeleton />
    </template>
  </Suspense>
</template>
