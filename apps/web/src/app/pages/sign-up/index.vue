<script setup lang="ts">
import { SessionModel } from "~entities/session";
import { SignUpPage } from "~pages/sign-up";

definePageMeta({
  title: "pages.sign-up.title",
  middleware: [
    function () {
      const { isLogedIn } = SessionModel.useSessionStore();

      if (isLogedIn)
        return navigateTo("/pages/constructor");
    },
  ],
});
</script>

<template>
  <SignUpPage />
</template>
