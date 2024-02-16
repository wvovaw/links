<script setup lang="ts">
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
    <Body class="bg-background text-foreground">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>
