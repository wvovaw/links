<script setup lang="ts">
import { toKebabCase } from "~utils/strings";

const props = defineProps<{
  title?: string;
}>();

const anchor = `#${props.title ? toKebabCase(props.title) : ""}`;
</script>

<template>
  <section class="my-5">
    <header class="w-full text-moon-20 h-16">
      <h3>
        <a :href="anchor">
          {{ title ? title : "Provide a title!" }}
        </a>
      </h3>
    <!-- TODO: add preview/code tabs with code preview -->
    </header>
    <div class="flex flex-wrap items-center justify-around p-4 gap-2 w-full bg-gohan text-moon-14 rounded-moon-s-sm">
      <slot />
    </div>
  </section>
</template>
