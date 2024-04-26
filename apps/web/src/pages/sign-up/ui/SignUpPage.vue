<script setup lang="ts">
import { UIButton, UICard } from "@links/ui";
import { SignUpForm } from "~features/auth";
</script>

<template>
  <div class="w-100vw flex flex-col place-self-center items-center gap-10 px-4 py-6 container md:flex-row">
    <div class="flex-auto max-md:text-center">
      <h2 class="text-moon-32 font-bold lg:text-moon-48">
        This is the <span class="from-hit to-piccolo bg-gradient-to-r bg-clip-text text-transparent font-extrabold">Links</span>
      </h2>
      <p class="mt-6 text-moon-16">
        Create a personal account to get a full access.
      </p>
    </div>
    <div class="lg:min-w-md sm:min-w-sm">
      <UICard.Root>
        <UICard.Header>
          <UICard.Title>Sign Up</UICard.Title>
        </UICard.Header>
        <UICard.Body>
          <SignUpForm />
        </UICard.Body>
        <UICard.Footer>
          <UIButton variant="link" as-child class="text-trunks" full-width>
            <NuxtLinkLocale to="/sign-in">
              Already have an account? Sign In
            </NuxtLinkLocale>
          </UIButton>
        </UICard.Footer>
      </UICard.Root>
    </div>
  </div>
</template>
