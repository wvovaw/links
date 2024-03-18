<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue"
import { UISkeleton } from "~ui/Skeleton";
import { UIButton } from "~ui/Button";
import { UICard } from "~ui/Card";

const fin = ref(false);

onMounted(() => {
  setTimeout(() => fin.value = true, 2000)
})
</script>

<template>
  <PreviewFrame>
    <UICard.Root class="w-sm">
      <UICard.Header>
        <UICard.Title>
          <template v-if="fin">
            Cool shoes
          </template>
          <UISkeleton v-else class="h-[24px] w-32" />
        </UICard.Title>
        <UICard.Subtitle>
          <template v-if="fin">
            This is the best shoes in the world
          </template>
          <div v-else class="flex gap-3 items-center h-[24px]">
            <UISkeleton  class="h-3 w-32" />
            <UISkeleton  class="h-3 w-12" />
            <UISkeleton  class="h-3 w-28" />
            <UISkeleton  class="h-3 w-16" />
          </div>
        </UICard.Subtitle>
      </UICard.Header>
      <UICard.Body>
        <NuxtImg
          v-if="fin"
          src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=720&auto=format"
          alt="shoes image"
          fit="center"
          height="200px"
          class="h-[200px] w-full object-cover rounded-moon-s-sm"
        />
        <UISkeleton v-else class="w-full h-[200px] rounded-moon-s-sm!" />
      </UICard.Body>
      <UICard.Footer class="flex justify-between">
        <span class="text-moon-32 font-bold text-nowrap">
          <template v-if="fin">
            $ 169
          </template>
          <UISkeleton v-else class="h-[40px] w-18" />
        </span>
        <UIButton icon="i-lucide:shopping-basket" icon-pos="right" @click="fin = !fin">Add to cart</UIButton>
      </UICard.Footer>
    </UICard.Root>
  </PreviewFrame>
</template>
