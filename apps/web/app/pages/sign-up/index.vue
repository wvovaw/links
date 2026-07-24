<script setup lang="ts">
import { SignUpPage } from "~pages/sign-up";

definePageMeta({
  title: "pages.sign-up.title",
  middleware: "guest",
});
</script>

<template>
  <SignUpPage />
</template>
