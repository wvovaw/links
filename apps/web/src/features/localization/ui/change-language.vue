<!-- TODO: use browserDetected language on first app load; Set prefered language cookie on change; -->
<script setup lang="ts">
import type { AcceptableValue } from "reka-ui";
import type { HTMLAttributes } from "vue";

import { UIRichSelect } from "@links/ui";

const { locale, locales, setLocale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

function onChangeLocale(newLocale: AcceptableValue) {
  setLocale(String(newLocale) as "en" | "ru");
  router.replace(switchLocalePath(locale.value));
}
</script>

<template>
  <UIRichSelect.Root :model-value="locale" @update:model-value="onChangeLocale">
    <UIRichSelect.Trigger :class="props.class">
      <UIRichSelect.Value />
    </UIRichSelect.Trigger>
    <UIRichSelect.Content>
      <UIRichSelect.Item v-for="l of locales" :key="l.code" :value="l.code">
        {{ l.name }}
      </UIRichSelect.Item>
    </UIRichSelect.Content>
  </UIRichSelect.Root>
</template>
