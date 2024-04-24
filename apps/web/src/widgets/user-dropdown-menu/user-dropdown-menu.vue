<script setup lang="ts">
import { UIDropdownMenu } from "@links/ui";
import { SignOutButton } from "~features/auth";
import { ToggleTheme } from "~features/ui-theme";
</script>

<template>
  <UIDropdownMenu.Item disabled>
    <UIDropdownMenu.ItemTitle>Profile</UIDropdownMenu.ItemTitle>
  </UIDropdownMenu.Item>

  <UIDropdownMenu.Item disabled>
    <UIDropdownMenu.ItemTitle>Settings</UIDropdownMenu.ItemTitle>
  </UIDropdownMenu.Item>

  <UIDropdownMenu.Separator />

  <UIDropdownMenu.Item>
    <UIDropdownMenu.ItemTitle>
      <SignOutButton />
    </UIDropdownMenu.ItemTitle>
    <UIDropdownMenu.ItemIcon icon="i-lucide:log-out" />
  </UIDropdownMenu.Item>

  <UIDropdownMenu.Separator />
  <ToggleTheme variant="ghost" size="xs" full-width />
</template>
