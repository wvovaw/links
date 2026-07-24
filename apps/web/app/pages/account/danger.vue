<script setup lang="ts">
import { AccountDangerPage } from "~pages/account";

definePageMeta({
  title: "pages.account-danger.title",
  middleware: "auth",
});
</script>

<template>
  <AccountDangerPage />
</template>
