<script setup lang="ts">
import { UIMenu } from "~ui/Menu";
import { UITag } from "~ui/Tag";

defineProps<{
  links: any;
  title: string;
}>();
</script>

<template>
  <div class="mb-4 mt-6 ps-2 text-moon-10-caption text-trunks font-medium uppercase">
    {{ title }}
  </div>
  <ul class="flex flex-col space-y-1">
    <li v-for="link of links" :key="link._path">
      <NuxtLink :to="link._path" class="group" active-class="active">
        <UIMenu.Item class="group-[.active]:bg-heles!">
          <UIMenu.Title>{{ link.title }}</UIMenu.Title>
          <UITag v-if="link.draft" icon-right="i-lucide:wrench" size="xs" color="krillin">
            draft
          </UITag>
          <UITag v-if="link.new" size="xs" color="roshi">
            new
          </UITag>
        </UIMenu.Item>
      </NuxtLink>
    </li>
  </ul>
</template>
