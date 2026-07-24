<script setup lang="ts">
import { SignInPage } from "~pages/sign-in";

definePageMeta({
  title: "pages.sign-in.title",
  middleware: "guest",
});
</script>

<template>
  <SignInPage />
</template>
