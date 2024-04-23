<script setup lang="ts">
import { UIButton, UICard } from "@links/ui";
import { SignInForm } from "~features/auth";
</script>

<template>
  <div class="w-100vw flex flex-col items-center gap-10 px-4 py-6 container md:flex-row">
    <div class="flex-auto max-md:text-center">
      <h2 class="text-moon-32 font-bold lg:text-moon-48">
        This is the <span class="from-hit to-piccolo bg-gradient-to-r bg-clip-text text-transparent font-extrabold">Links</span>
      </h2>
      <p class="mt-6 text-moon-16">
        Login to your account to get access to all your multilinks pages.
      </p>
    </div>
    <div class="lg:min-w-md sm:min-w-sm">
      <UICard.Root>
        <UICard.Header>
          <UICard.Title>Sign In</UICard.Title>
        </UICard.Header>
        <UICard.Body>
          <SignInForm />
        </UICard.Body>
        <UICard.Footer>
          <UIButton variant="link" as-child class="text-trunks" full-width>
            <NuxtLinkLocale to="/sign-up">
              Don't have an account? Sign Up
            </NuxtLinkLocale>
          </UIButton>
        </UICard.Footer>
      </UICard.Root>
    </div>
  </div>
</template>
