<script setup lang="ts">
import { AccountGeneralPage } from "~pages/account";

definePageMeta({
  title: "pages.account-general.title",
  middleware: "auth",
});
</script>

<template>
  <AccountGeneralPage />
</template>
