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

      <ContentDoc>
        <template #default="{ doc }">
          <div class="gap-8 md:grid lg:grid-cols-[minmax(250px,250px)_minmax(320px,1fr)_minmax(250px,250px)] md:grid-cols-[minmax(250px,250px)_minmax(320px,1fr)]">
            <DocsAsideNavigation class="hidden md:block" />
            <main class="max-w-screen-lg p-4 lg:p-0">
              <slot />
            </main>
            <DocsTableOfContents :value="doc" class="hidden lg:block" />
          </div>
        </template>
      </ContentDoc>
    </Body>
  </Html>
</template>
