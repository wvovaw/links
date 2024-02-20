<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <h4 class="w-full text-start">
      Fill variant
    </h4>
    <div class="w-full flex justify-around">
      <UIButton>
        Piccolo
      </UIButton>
      <UIButton color="hit">
        Hit
      </UIButton>
      <UIButton color="chichi">
        Chichi
      </UIButton>
      <UIButton color="krillin">
        Krillin
      </UIButton>
      <UIButton color="roshi">
        Roshi
      </UIButton>
    </div>

    <h4 class="w-full text-start">
      Outline variant
    </h4>
    <div class="w-full flex justify-around">
      <UIButton variant="outline">
        Piccolo
      </UIButton>
      <UIButton variant="outline" color="hit">
        Hit
      </UIButton>
      <UIButton variant="outline" color="chichi">
        Chichi
      </UIButton>
      <UIButton variant="outline" color="krillin">
        Krillin
      </UIButton>
      <UIButton variant="outline" color="roshi">
        Roshi
      </UIButton>
    </div>

    <h4 class="w-full text-start">
      Ghost variant
    </h4>
    <div class="w-full flex justify-around">
      <UIButton variant="ghost">
        Piccolo
      </UIButton>
      <UIButton variant="ghost" color="hit">
        Hit
      </UIButton>
      <UIButton variant="ghost" color="chichi">
        Chichi
      </UIButton>
      <UIButton variant="ghost" color="krillin">
        Krillin
      </UIButton>
      <UIButton variant="ghost" color="roshi">
        Roshi
      </UIButton>
    </div>

    <h4 class="w-full text-start">
      Link variant
    </h4>
    <div class="w-full flex justify-around">
      <UIButton variant="link">
        Piccolo
      </UIButton>
      <UIButton variant="link" color="hit">
        Hit
      </UIButton>
      <UIButton variant="link" color="chichi">
        Chichi
      </UIButton>
      <UIButton variant="link" color="krillin">
        Krillin
      </UIButton>
      <UIButton variant="link" color="roshi">
        Roshi
      </UIButton>
    </div>
  </PreviewFrame>
</template>
