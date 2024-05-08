<script setup lang="ts">
import UtilityTag from "../UtilityTag";

const [SetBlock, Block] = createReusableTemplate();
</script>

<template>
  <SetBlock v-slot="{ $slots }">
    <div class="aspect-1/1 w-36 border-(2 beerus)">
      <div class="grid h-full w-full place-content-center uppercase">
        <component :is="$slots.default" />
      </div>
    </div>
  </SetBlock>

  <h4>Interactive elements</h4>

  <div class="flex flex-wrap gap-4">
    <div class="flex flex-col items-center gap-4">
      <UtilityTag>
        rounded-moon-i-xs
      </UtilityTag>
      <Block class="rounded-moon-i-xs">
        xs
      </Block>
    </div>

    <div class="flex flex-col items-center gap-4">
      <UtilityTag>
        rounded-moon-i-sm
      </UtilityTag>
      <Block class="rounded-moon-i-sm">
        sm
      </Block>
    </div>

    <div class="flex flex-col items-center gap-4">
      <UtilityTag>
        rounded-moon-i-md
      </UtilityTag>
      <Block class="rounded-moon-i-md">
        md
      </Block>
    </div>
  </div>

  <h4>Surface elements</h4>

  <div class="flex flex-wrap gap-4">
    <div class="flex flex-col items-center gap-4">
      <UtilityTag>
        rounded-moon-s-xs
      </UtilityTag>
      <Block class="rounded-moon-s-xs">
        xs
      </Block>
    </div>

    <div class="flex flex-col items-center gap-4">
      <UtilityTag>
        rounded-moon-s-sm
      </UtilityTag>
      <Block class="rounded-moon-s-sm">
        sm
      </Block>
    </div>

    <div class="flex flex-col items-center gap-4">
      <UtilityTag>
        rounded-moon-s-md
      </UtilityTag>
      <Block class="rounded-moon-s-md">
        md
      </Block>
    </div>

    <div class="flex flex-col items-center gap-4">
      <UtilityTag>
        rounded-moon-s-lg
      </UtilityTag>
      <Block class="rounded-moon-s-lg">
        lg
      </Block>
    </div>
  </div>
</template>
