<script setup lang="ts">
import UtilityTag from "../UtilityTag";
import { UIInsertInput } from "~ui";

const [SetPair, Pair] = createReusableTemplate();

const defaultText = "Jumping hay dwarves flock quartz box.";
const userText = ref<string>();
const text = computed(() => {
  if (userText.value?.length)
    return userText.value;
  else return defaultText;
});
</script>

<template>
  <SetPair v-slot="{ $slots }">
    <div class="rounded-moon-s-sm bg-gohan p-4 space-y-2">
      <component :is="$slots.default" />
    </div>
  </SetPair>

  <div class="my-4">
    <UIInsertInput v-model="userText" label="Type your text" :placeholder="defaultText" />
  </div>

  <div class="space-y-5">
    <Pair>
      <div class="border-(1 beerus dashed) text-moon-9">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-9
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-9-caption">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-9-caption
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-10">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-10
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-10-caption">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-10-caption
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-12">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-12
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-14">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-14
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-16">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-16
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-18">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-18
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-20">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-20
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-24">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-24
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-32">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-32
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-40">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-40
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-48">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-48
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-56">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-56
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-64">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-64
      </UtilityTag>
    </Pair>

    <Pair>
      <div class="border-(1 beerus dashed) text-moon-72">
        {{ text }}
      </div>
      <UtilityTag class="grid-1">
        text-moon-72
      </UtilityTag>
    </Pair>
  </div>
</template>
