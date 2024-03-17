<script setup lang="ts">
import { ConfigProvider } from "radix-vue";
import { UITooltipProvider } from "~ui/Tooltip";

const useIdFunction = () => useId();

const expireDate = new Date();
expireDate.setFullYear(expireDate.getFullYear() + 1);

let cookie = useCookie<{
  theme: string;
}>("theme", {
  default: () => ({ theme: "auto" }),
  expires: expireDate,
  watch: "shallow",
});

addRouteMiddleware("theme-cookie-update", () => {
  cookie = useCookie("theme");
}, { global: true });
</script>

<template>
  <Html :data-theme="cookie.theme" dir="ltr">
    <Body class="bg-goku text-bulma font-dm-sans font-regular">
      <ConfigProvider :use-id="useIdFunction">
        <UITooltipProvider>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </UITooltipProvider>
      </ConfigProvider>
    </Body>
  </Html>
</template>
