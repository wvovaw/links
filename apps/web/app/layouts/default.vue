<script setup lang="ts">
import { UIButton } from "@links/ui";
import { SessionModel, UserDropdown } from "~entities/session";
import { ToggleTheme } from "~features/ui-theme";
import { NavigationMenu, TopNavbar } from "~widgets/top-navbar";
import { UserDropdownMenu } from "~widgets/user-dropdown-menu";

const route = useRoute();
const { t } = useI18n();
const head = useLocaleHead({
  dir: true,
  seo: true,
});

useHead({
  htmlAttrs: head.value.htmlAttrs,
  link: head.value.link,
  meta: head.value.meta,
});

const title = computed(() => t(route.meta.title as string));

const sessionStore = SessionModel.useSessionStore();
const { isLogedIn } = storeToRefs(sessionStore);
</script>

<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <Body>
      <TopNavbar>
        <template #left>
          <NavigationMenu />
        </template>
        <template #right>
          <UserDropdown v-if="isLogedIn">
            <UserDropdownMenu />
          </UserDropdown>
          <div v-else class="w-fit flex items-center gap-2">
            <NuxtLinkLocale to="sign-in" aria-label="sign in">
              <UIButton variant="ghost" size="sm" icon="i-lucide:user" class="rounded-full!" />
              <span class="sr-only">Sign In</span>
            </NuxtLinkLocale>
            <ToggleTheme size="sm" icon-only />
          </div>
        </template>
      </TopNavbar>

      <!--
        `min-w-0`: a grid item's automatic minimum size is its content's, so without it a page holding
        something wide — a table, a row of cards — widens the whole document and the reader scrolls sideways
        instead of the table scrolling inside its own card.
      -->
      <div class="grid min-h-[calc(100vh-var(--navbar-height))]">
        <div class="min-w-0 flex flex-col">
          <slot />
        </div>
      </div>
    </Body>
  </Html>
</template>
