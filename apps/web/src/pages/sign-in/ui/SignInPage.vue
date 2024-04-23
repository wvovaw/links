<script setup lang="ts">
import { UIButton, UICard } from "@links/ui";
import { SignInForm } from "~features/auth";
</script>

<template>
  <section class="">
    <div class="mx-auto flex flex-wrap items-center px-5 py-24 container">
      <div class="pr-0 lg:w-3/5 md:w-1/2 lg:pr-0 md:pr-16">
        <h1 class="text-3xl font-medium">
          Morbi in sem quis dui placerat ornare. Pellentesque odio nisi euismod in pharetra a ultricies in diam. Sed arcu.
        </h1>
        <p class="mt-4 leading-relaxed">
          Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam gravida non commodo a sodales sit amet nisi.
        </p>
      </div>
      <UICard.Root class="mt-10 w-full md:ml-auto md:mt-0 lg:w-2/6 md:w-1/2">
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
  </section>
</template>
