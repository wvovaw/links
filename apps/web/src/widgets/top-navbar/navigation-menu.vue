<script setup lang="tsx">
</script>

<template>
  <div class="flex items-center gap-6 font-semibold font-averta">
    <div class="flex items-center text-center text-2xl">
      <NuxtLinkLocale to="/" class="flex items-center">
        <span class="i-lucide:link inline-block h-6 w-6" />
      </NuxtLinkLocale>
    </div>
    <div class="flex gap-8 text-trunks">
      <NuxtLinkLocale to="/links" class="transition-colors duration-250 hover:text-bulma">
        Links
      </NuxtLinkLocale>
      <NuxtLinkLocale to="/account" class="transition-colors duration-250 hover:text-bulma">
        Account
      </NuxtLinkLocale>
    </div>
  </div>
</template>
