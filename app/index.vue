<script setup lang="ts">
const expireDate = new Date();
expireDate.setFullYear(expireDate.getFullYear() + 1);

let cookie = useCookie<{
  theme: string;
}>("theme", {
  default: () => ({ theme: "" }),
  expires: expireDate,
  watch: "shallow",
});

addRouteMiddleware("theme-cookie-update", () => {
  cookie = useCookie("theme");
}, { global: true });
</script>

<template>
  <Html :data-theme="cookie.theme">
    <Body class="text-fg">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>
