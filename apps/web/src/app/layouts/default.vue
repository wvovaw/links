<script setup lang="ts">
import { UIButton } from "@links/ui";
import { TopNavbar } from "~widgets/top-navbar";
import { UserDropdownMenu } from "~/widgets/user-dropdown-menu";
import { ToggleTheme } from "~features/ui-theme";
import { SessionModel, UserDropdown } from "~entities/session";

const route = useRoute();
const { t } = useI18n();
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: true,
});

const title = computed(() => t(route.meta.title as string));

const sessionStore = SessionModel.useSessionStore();
const { isLogedIn } = storeToRefs(sessionStore);
</script>

<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
    <Head>
      <Title>{{ title }}</Title>
      <template v-for="link in head.link" :key="link.id">
        <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
      </template>
      <template v-for="meta in head.meta" :key="meta.id">
        <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
      </template>
    </Head>
    <Body>
      <TopNavbar>
        <template #left>
          <div class="flex items-center text-center text-2xl font-semibold font-averta">
            {{ t("site.sitename") }}
          </div>
        </template>
        <template #right>
          <UserDropdown v-if="isLogedIn">
            <UserDropdownMenu class="my-2"/>
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

      <div class="grid min-h-[calc(100vh-var(--navbar-height))] place-content-center">
        <slot />
      </div>
    </Body>
  </Html>
</template>
