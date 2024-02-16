<!-- TODO: use browserDetected language on first app load; Set prefered language cookie on change; -->
<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();

function onChangeLocale(newLocale: string) {
  setLocale(newLocale);
  router.replace(switchLocalePath(locale.value));
}
</script>

<template>
  <select class="bg-background fg-foreground" :value="locale" @change.prevent="(e: Event) => onChangeLocale((e.target as HTMLSelectElement).value)">
    <option v-for="l of locales" :key="l.code" :value="l.code">
      {{ l.name }}
    </option>
  </select>
</template>
