<script setup lang="ts">
import { UIAvatar, UIDropdownMenu } from "@links/ui";
import { useSessionStore } from "../../model";

const sessionStore = useSessionStore();
const { user } = storeToRefs(sessionStore);

const [isOpen, toggle] = useToggle(false);
</script>

<template>
  <UIDropdownMenu.Root v-model:open="isOpen">
    <UIDropdownMenu.Trigger @click="toggle">
      <div class="flex gap-2">
        <UIAvatar.Root class="border border-beerus" shape="circle">
          <UIAvatar.Image v-if="user?.avatarUrl" :src="user?.avatarUrl" />
          <UIAvatar.Fallback>{{ user?.name.substring(0, 2) }}</UIAvatar.Fallback>
        </UIAvatar.Root>
        <span class="place-self-center">{{ user?.name }}</span>
        <span
          class="i-lucide:chevron-down inline-block h-4 w-4 place-self-center text-trunks transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </UIDropdownMenu.Trigger>
    <UIDropdownMenu.Content class="mx-1 border border-beerus" align="start" :side-offset="20">
      <slot>
        <DevOnly>
          Provide a dropdown menu items
        </DevOnly>
      </slot>
    </UIDropdownMenu.Content>
  </UIDropdownMenu.Root>
</template>
