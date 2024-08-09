<script setup lang="ts">
import { UIButton } from "@links/ui";

defineProps<{
  linkId: string;
  linkName: string;
}>();
</script>

<template>
  <div class="absolute bottom-4 right-4">
    <div class="rounded-moon-s-sm bg-beerus p-3">
      <div class="flex flex-col items-center gap-2 text-moon-14">
        <span>
          Page ID: {{ linkId }}
        </span>
        <span>
          Link name: {{ linkName }}
        </span>
      </div>
      <div class="flex gap-4">
        <UIButton variant="ghost" size="sm" icon="i-lucide:arrow-left" @click="useRouter().back">
          Go back
        </UIButton>
        <UIButton variant="ghost" size="sm" icon="i-lucide:hammer" @click="useRouter().push(`/links/constructor/${linkId}`)">
          Edit page
        </UIButton>
      </div>
    </div>
  </div>
</template>
