<script setup lang="ts">
import { useGuestsStore } from "./stores/guests.store";
import { UIInput } from "~ui/Input";
import { UIButton } from "~ui/Button";
import { UICard, UICardContent, UICardDescription, UICardHeader, UICardTitle } from "~ui/Card";

const wuxtStore = useGuestsStore();
wuxtStore.$patch({
  guests: ["Cheburashka", "Gena the Crocodile"],
});
const { guests } = storeToRefs(wuxtStore);
const { addGuest } = wuxtStore;

const name = defineModel<string>({ default: "" });
const list = ref<HTMLElement>();

async function onSubmit() {
  if (name.value.length > 0) {
    addGuest(name.value);
    name.value = "";
    await nextTick();
    list.value?.scrollTo({ top: list.value?.scrollHeight });
  }
}

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
      <ul ref="list" class="mb-2 h-12em overflow-y-auto">
        <li
          v-for="guest of guests"
          :key="guest"
          class="before:(content-['♦'] p-r-2)"
        >
          {{ guest }}
        </li>
      </ul>
      <form class="flex w-full items-center gap-1.5" @submit.prevent="onSubmit">
        <UIInput v-model="name" :placeholder="t('name')" />
        <UIButton type="submit">
          {{ t("add") }}
        </UIButton>
      </form>
    </UICardContent>
  </UICard>
</template>

<i18n lang="yaml">
  en:
    title: "Guests list"
    description: "Pinia driven demo widget"
    add: "Add"
    name: "Guest name"
  ru:
    title: "Список гостей"
    description: "Демо виджет с Pinia стором"
    add: "Добавить"
    name: "Имя гостя"
</i18n>
