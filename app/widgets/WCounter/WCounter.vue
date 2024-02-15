<script setup lang="ts">
import useCounter from "./composables/useCounter";

import { UIButton } from "~ui/Button";
import { UICard, UICardContent, UICardDescription, UICardHeader, UICardTitle } from "~ui/Card";

interface ICounterProps {
  initial?: number;
}
const props = defineProps<ICounterProps>();

const counter = useCounter({ init: props.initial });

const { t } = useI18n({ useScope: "local" });
</script>

<template>
  <UICard>
    <UICardHeader>
      <UICardTitle>{{ t("title") }}</UICardTitle>
      <UICardDescription>
        {{ t("description") }}
      </UICardDescription>
    </UICardHeader>
    <UICardContent>
      <div class="flex flex-col w-full gap-5 place-items-center" data-test="inc">
        <div class="grid place-content-center text-center h-34">
          <span class="font-mono text-5xl" data-test="counter">
            {{ counter.counter }}
          </span>
        </div>
        <span class="w-full flex flex-row gap-5">
          <UIButton class="w-full h-20 text-2xl" @click="counter.increment">
            +
          </UIButton>
          <UIButton data-test="dec" class="w-full h-20 text-2xl" @click="counter.decrement">
            -
          </UIButton>
        </span>
      </div>
    </UICardContent>
  </UICard>
</template>

<i18n lang="yaml">
ru:
  title: "Счётчик"
  description: "Простой демо-виджет счётчик"
en:
  title: "Counter"
  description: "Simple counter demo widget"
</i18n>
