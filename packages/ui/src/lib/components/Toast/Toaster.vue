<script setup lang="ts">
import { isVNode } from "vue";
import { useToast } from "./useToast";
import { UIToast, UIToastProvider } from ".";

const { toasts } = useToast();
</script>

<template>
  <UIToastProvider>
    <UIToast.Root v-for="toast in toasts" :key="toast.id" v-bind="toast">
      <div class="grid gap-1">
        <UIToast.Title v-if="toast.title">
          {{ toast.title }}
        </UIToast.Title>
        <template v-if="toast.content">
          <UIToast.Content v-if="isVNode(toast.content)">
            <component :is="toast.content" />
          </UIToast.Content>
          <UIToast.Content v-else>
            {{ toast.content }}
          </UIToast.Content>
        </template>
        <UIToast.Close />
      </div>
      <component :is="toast.action" />
    </UIToast.Root>
    <Teleport to="#teleports">
      <UIToast.Viewport />
    </Teleport>
  </UIToastProvider>
</template>
