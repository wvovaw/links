<script setup lang="ts">
import { SignInPage } from "~pages/sign-in";
import { SessionModel } from "~entities/session";

definePageMeta({
  title: "pages.sign-in.title",
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
  <SignInPage />
</template>
