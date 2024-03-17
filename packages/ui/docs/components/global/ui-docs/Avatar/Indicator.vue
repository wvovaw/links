<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIAvatar } from "~ui/Avatar";
</script>

<template>
  <PreviewFrame>
    <div class="w-full flex items-center justify-around">
      <UIAvatar.Root>
        <UIAvatar.Fallback>TL</UIAvatar.Fallback>
        <UIAvatar.Indicator vertical="top" horizontal="start" />
      </UIAvatar.Root>
      <UIAvatar.Root>
        <UIAvatar.Fallback>TR</UIAvatar.Fallback>
        <UIAvatar.Indicator vertical="top" horizontal="end" />
      </UIAvatar.Root>
      <UIAvatar.Root>
        <UIAvatar.Fallback>BR</UIAvatar.Fallback>
        <UIAvatar.Indicator vertical="bottom" horizontal="end" />
      </UIAvatar.Root>
      <UIAvatar.Root>
        <UIAvatar.Fallback>BL</UIAvatar.Fallback>
        <UIAvatar.Indicator vertical="bottom" horizontal="start" />
      </UIAvatar.Root>
    </div>
    <div class="w-full flex items-center justify-around">
      <UIAvatar.Root>
        <UIAvatar.Fallback>CH</UIAvatar.Fallback>
        <UIAvatar.Indicator color="chichi" />
      </UIAvatar.Root>
      <UIAvatar.Root>
        <UIAvatar.Fallback>KR</UIAvatar.Fallback>
        <UIAvatar.Indicator color="krillin" />
      </UIAvatar.Root>
      <UIAvatar.Root>
        <UIAvatar.Fallback>RO</UIAvatar.Fallback>
        <UIAvatar.Indicator color="roshi" />
      </UIAvatar.Root>
    </div>
    <div class="w-full flex items-center justify-around">
      <UIAvatar.Root>
        <UIAvatar.Fallback>PG</UIAvatar.Fallback>
        <UIAvatar.Indicator color="roshi" :ping="true" />
      </UIAvatar.Root>
    </div>
  </PreviewFrame>
</template>
