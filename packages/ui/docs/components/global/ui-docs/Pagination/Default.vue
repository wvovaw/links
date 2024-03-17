<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIPagination } from "~ui/Pagination";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <UIPagination.Root v-slot="{ page }" :total="500" :items-per-page="10" :sibling-count="1" show-edges class="w-full flex justify-between">
      <div class="flex gap-1">
        <UIPagination.First />
        <UIPagination.Prev />
      </div>
      <UIPagination.List v-slot="{ items }" class="flex items-center gap-1">
        <template v-for="(item, index) in items">
          <UIPagination.ListItem
            v-if="item.type === 'page'"
            :key="index"
            :value="item.value"
            as-child
          >
            <UIButton
              class="h-8 w-8"
              size="sm"
              :variant="item.value === page ? 'fill' : 'ghost'"
            >
              {{ item.value }}
            </UIButton>
          </UIPagination.ListItem>
          <UIPagination.Elipsis
            v-else
            :key="item.type"
            :index="index"
          />
        </template>
      </UIPagination.List>
      <div class="flex gap-1">
        <UIPagination.Next />
        <UIPagination.Last />
      </div>
    </UIPagination.Root>
  </PreviewFrame>
</template>
