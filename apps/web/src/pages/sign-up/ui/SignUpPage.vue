<script setup lang="ts">
import { UICard } from "@links/ui";
import { SignUpForm } from "~features/auth";
</script>

<template>
  <section class="">
    <div class="mx-auto flex flex-wrap items-center px-5 py-24 container">
      <div class="pr-0 lg:w-3/5 md:w-1/2 lg:pr-0 md:pr-16">
        <h1 class="text-3xl font-medium">
          Slow-carb next level shoindcgoitch ethical authentic, poko scenester
        </h1>
        <p class="mt-4 leading-relaxed">
          Poke slow-carb mixtape knausgaard, typewriter street art gentrify hammock starladder roathse. Craies vegan tousled etsy austin.
        </p>
      </div>
      <UICard.Root class="mt-10 w-full md:ml-auto md:mt-0 lg:w-2/6 md:w-1/2">
        <UICard.Header>
          <UICard.Title>Sign Up</UICard.Title>
        </UICard.Header>
        <UICard.Body>
          <SignUpForm />
        </UICard.Body>
      </UICard.Root>
    </div>
  </section>
</template>
