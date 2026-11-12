<script setup lang="ts">
import { UIToaster, UITooltipProvider } from "@links/ui";
import { ConfigProvider } from "reka-ui";
import { type ITheme, THEME_CONFIG } from "~entities/ui-theme";
import { ConfirmationDialog } from "~shared/ui/confirmation-dialog";

const useIdFunction = () => useId();

const expireDate = new Date();
expireDate.setFullYear(expireDate.getFullYear() + 1);

const cookie = useCookie<ITheme>(THEME_CONFIG.cookieKey, {
  default: THEME_CONFIG.defaultValue,
  expires: expireDate,
  watch: "shallow",
});

useHead({
  htmlAttrs: { "data-theme": cookie.value.theme },
});
</script>

<template>
  <Html>
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
