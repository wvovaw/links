<script setup lang="ts">
import { ConfigProvider } from "radix-vue";
import { UIToaster } from "~ui/Toast";
import { UITooltipProvider } from "~ui/Tooltip";

const useIdFunction = () => useId();

const expireDate = new Date();
expireDate.setFullYear(expireDate.getFullYear() + 1);

let cookie = useCookie<{
  theme: string;
}>("theme", {
  expires: expireDate,
  watch: true,
});
if (!cookie.value) cookie.value = { theme: "auto" };

addRouteMiddleware(
  "theme-cookie-update",
  () => {
    cookie = useCookie("theme");
  },
  { global: true },
);
</script>

<template>
  <Html :data-theme="cookie.theme" dir="ltr">
    <Body class="bg-goku text-bulma font-regular font-dm-sans">
      <ConfigProvider :use-id="useIdFunction">
        <UITooltipProvider>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </UITooltipProvider>
        <UIToaster />
      </ConfigProvider>
    </Body>
  </Html>
</template>
