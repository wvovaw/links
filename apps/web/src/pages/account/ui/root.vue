<script setup lang="ts">
import { UISeparator } from "@links/ui";
</script>

<template>
  <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
    <div class="grid mx-auto max-w-6xl w-full gap-2">
      <h1 class="text-moon-24 font-semibold">
        Account Settings
      </h1>
    </div>
    <div class="grid mx-auto max-w-6xl w-full items-start gap-6 lg:grid-cols-[250px_1fr] md:grid-cols-[180px_1fr]">
      <nav class="grid gap-4 text-moon-14 text-trunks">
        <NuxtLinkLocale to="/account" class="text-bulma" exact-active-class="font-semibold">
          General
        </NuxtLinkLocale>
        <UISeparator />
        <NuxtLinkLocale to="/account/danger" class="text-chichi" exact-active-class="font-semibold">
          Danger
        </NuxtLinkLocale>
      </nav>
      <div class="grid gap-6">
        <slot />
      </div>
    </div>
  </main>
</template>
