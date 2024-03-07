<script setup lang="ts">
import { UITooltipProvider } from "~ui/Tooltip";

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
  <Html :data-theme="cookie.theme">
    <Body class="bg-goku text-bulma font-dm-sans font-regular">
      <UITooltipProvider>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </UITooltipProvider>
    </Body>
  </Html>
</template>
