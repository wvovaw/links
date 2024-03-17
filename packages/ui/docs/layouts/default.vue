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
          <span class="flex flex items-center gap-2 text-center align-end text-2xl font-semibold font-averta">
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
