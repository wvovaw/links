<script setup lang="ts">
import { UIButton } from "~ui/Button";
import { UICard, UICardContent, UICardDescription, UICardFooter, UICardHeader, UICardTitle } from "~ui/Card";

const { data, status, refresh } = await useFetch("/api/8ball", {
  server: false,
  immediate: false,
});

const answer = computed(() => data.value?.eightBallSays);

const { t } = useI18n({ useScope: "local" });
</script>

<template>
  <UICard>
    <UICardHeader>
      <UICardTitle>{{ t("title") }}</UICardTitle>
      <UICardDescription>{{ t("description") }}</UICardDescription>
    </UICardHeader>
    <UICardContent>
      <div class="flex flex-col gap-10 w-full items-center">
        <div class="text-md text-fg/50 text-center">
          {{ t("askTheBall") }}
        </div>
        <div class="w-full h-6em grid place-content-center items-center text-center">
          <span v-if="status === 'pending'" class="fill-fg w-6 h-6 i-lucide:loader-2 animate-spin animate-duration-1000" />
          <span v-else class="h-6 text-xl font-semibold" data-test="answer">{{ answer }}</span>
        </div>
        <UIButton class="w-full" :disabled="status === 'pending'" @click="refresh">
          {{ t("ask") }}
        </UIButton>
      </div>
    </UICardContent>
  </UICard>
</template>

<i18n lang="yaml">
en:
  title: "Magic 8all"
  description: "Nitro server driven demo widget"
  askTheBall: "Ask the Magic 8ball a question"
  ask: "Ask"
ru:
  title: "Магический шар"
  description: "Демо виджет с api запросом к Nitro"
  askTheBall: "Задай вопрос магическому шару"
  ask: "Спросить"
</i18n>
