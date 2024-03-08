<script setup lang="ts">
import { UIMenu } from "~ui/Menu";
import { UITag } from "~ui/Tag";

defineProps<{
  links: any;
  title: string;
}>();
</script>

<template>
  <div class="ps-2 mt-6 mb-4 text-moon-10-caption font-medium uppercase text-trunks">
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
