<script setup lang="ts">
import UtilityTag from "../UtilityTag";

const [SetBlock, Block] = createReusableTemplate();
</script>

<template>
  <SetBlock v-slot="{ $slots }">
    <div class="aspect-1/1 w-36 border-(1 beerus) rounded-moon-s-md">
      <div class="grid h-full w-full place-content-center uppercase">
        <component :is="$slots.default" />
      </div>
    </div>
  </SetBlock>

  <div class="flex flex-wrap gap-4">
    <div class="flex flex-col items-center gap-4">
      <UtilityTag>
        shadow-moon-xs
      </UtilityTag>
      <Block class="shadow-moon-xs">
        xs
      </Block>
    </div>

    <div class="flex flex-col items-center gap-4">
      <UtilityTag>
        shadow-moon-sm
      </UtilityTag>
      <Block class="shadow-moon-sm">
        sm
      </Block>
    </div>

    <div class="flex flex-col items-center gap-4">
      <UtilityTag>
        shadow-moon-md
      </UtilityTag>
      <Block class="shadow-moon-md">
        md
      </Block>
    </div>

    <div class="flex flex-col items-center gap-4">
      <UtilityTag>
        shadow-moon-lg
      </UtilityTag>
      <Block class="shadow-moon-lg">
        lg
      </Block>
    </div>

    <div class="flex flex-col items-center gap-4">
      <UtilityTag>
        shadow-moon-xl
      </UtilityTag>
      <Block class="shadow-moon-xl">
        xl
      </Block>
    </div>
  </div>
</template>
