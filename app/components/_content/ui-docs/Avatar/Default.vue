<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIAvatar } from "~ui/Avatar";
</script>

<template>
  <PreviewFrame>
    <UIAvatar.Root>
      <UIAvatar.Image
        src="https://img.tvreportcdn.de/cms-content/uploads/2023/05/24/46c2274c-f832-4e27-80bf-fa3982329ffd.jpg"
        alt="Ma Dong-seok avatar"
      />
      <UIAvatar.Fallback>마동</UIAvatar.Fallback>
    </UIAvatar.Root>
  </PreviewFrame>
</template>
