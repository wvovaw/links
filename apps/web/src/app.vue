<script setup lang="ts">
import { ConfigProvider } from "radix-vue";
import { UIToaster, UITooltipProvider } from "@links/ui";
import { ConfirmationDialog } from "~shared/ui/confirmation-dialog";
import { type ITheme, THEME_CONFIG } from "~entities/ui-theme";

const useIdFunction = () => useId();

const expireDate = new Date();
expireDate.setFullYear(expireDate.getFullYear() + 1);

let cookie = useCookie<ITheme>(THEME_CONFIG.cookieKey, {
  default: THEME_CONFIG.defaultValue,
  expires: expireDate,
  watch: "shallow",
});

addRouteMiddleware("theme-cookie-update", () => {
  cookie = useCookie(THEME_CONFIG.cookieKey);
}, { global: true });
</script>

<template>
  <Html :data-theme="cookie.theme">
    <Body class="bg-goku text-bulma font-regular font-dm-sans">
      <ConfigProvider :use-id="useIdFunction">
        <UITooltipProvider>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
          <UIToaster />
          <ConfirmationDialog />
        </UITooltipProvider>
      </ConfigProvider>
    </Body>
  </Html>
</template>
