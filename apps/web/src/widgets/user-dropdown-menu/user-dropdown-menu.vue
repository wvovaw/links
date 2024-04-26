<script setup lang="ts">
import { UIDropdownMenu } from "@links/ui";
import { SignOutButton } from "~features/auth";
import { ToggleTheme } from "~features/ui-theme";
</script>

<template>
  <NuxtLinkLocale to="/account">
    <UIDropdownMenu.Item>
      <UIDropdownMenu.ItemTitle>
        Account
      </UIDropdownMenu.ItemTitle>
      <UIDropdownMenu.ItemIcon icon="i-lucide:user" />
    </UIDropdownMenu.Item>
  </NuxtLinkLocale>

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
