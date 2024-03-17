<script setup lang="ts">
import pack from "../../package.json";
import { UITag } from "~ui/Tag";

const name = pack.name;
const version = pack.version;
</script>

<template>
  <Html>
    <Body>
      <NavigationBar>
        <template #left>
          <span class="font-averta font-semibold text-2xl text-center flex items-center flex gap-2 align-end">
            {{ name }} <UITag size="xs">{{ version }}</UITag>
          </span>
        </template>
        <template #right>
          <ThemeSwitcher />
        </template>
      </NavigationBar>
      <slot />
    </Body>
  </Html>
</template>
