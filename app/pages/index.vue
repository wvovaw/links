<script setup lang="ts">
import { HelloWuxt } from "~widgets/HelloWuxt";
import { GuestsList } from "~widgets/GuestsList";
import { MagicBall } from "~widgets/MagicBall";
import { WCounter } from "~widgets/WCounter";

definePageMeta({
  title: "site.pages.homepage.title",
});
</script>

<template>
  <div class="w-full grid lg:grid-cols-3 lg:grid-rows-2 gap-8">
    <HelloWuxt class="lg:col-span-3 row-span-1" />
    <GuestsList class="lg:col-span-1 lg:max-w-xs" />
    <MagicBall class="lg:col-span-1 lg:max-w-xs" />
    <WCounter :initial="-4" class="lg:col-span-1 lg:max-w-xs" />
  </div>
</template>
