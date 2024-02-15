<script setup>
import Eyes from "./components/Eyes.vue";
import { UICard, UICardContent, UICardDescription, UICardHeader, UICardTitle } from "~ui/Card";

const { t } = useI18n({ useScope: "local" });
</script>

<template>
  <UICard>
    <UICardHeader>
      <Eyes class="absolute place-self-end" />
      <UICardTitle>{{ t("title") }}</UICardTitle>
      <UICardDescription>
        {{ t("description") }}
      </UICardDescription>
    </UICardHeader>
    <UICardContent>
      <section class="prose prose-fg">
        <p>{{ t("content.title") }}</p>
        <ol>
          <li>{{ t("content.list.t1") }}</li>
          <li>{{ t("content.list.t2") }}</li>
          <li>{{ t("content.list.t3") }}</li>
        </ol>
      </section>
      <i18n-t keypath="content.readMore.t1" tag="span">
        <template #link>
          <NuxtLinkLocale to="/about" class="underline">
            {{ t("content.readMore.t2") }}
          </NuxtLinkLocale>
        </template>
      </i18n-t>
    </UICardContent>
  </UICard>
</template>

<i18n lang="yaml">
en:
  title: "Hello, this is Wuxt"
  description: "Preconfigured Nuxt 3 template"
  content:
    title: "The main purposes this exists"
    list:
      t1: "Seting up the same things every time is tedious"
      t2: "Nuxt 3 standard file structure pushes bad practices. This template disables autoimports for all developer written code and promotes colocation."
      t3: "Split Nuxt client and server parrts."
    readMore:
      t1: "Read more on {link} page"
      t2: "about"
ru:
  title: "Привет, это Wuxt"
  description: "Nuxt 3 стартер"
  content:
    title: "Почему этот шаблон существует:"
    list:
      t1: "Настраивать одно и то же каждый раз снова - утомительно"
      t2: "Стандартная файловая структура Nuxt 3 толкает на плохие практики. Этот шаблон отключает автоимпорты для всего кода, написанного разработчиками, и продвигает принцип colocation."
      t3: "Разделить клиентскую и серверную части Nuxt"
    readMore:
      t1: "Читайте больше на странице {link}"
      t2: "О Wuxt"
</i18n>
