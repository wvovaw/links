<script setup lang="ts">
import { UIInput, UIInputLabel, UISeparator } from "@links/ui";
import { OptionsSection } from "../options-section";
import { useConstructorStore } from "../../model";

const constructorStore = useConstructorStore();
const { title } = storeToRefs(constructorStore);
</script>

<template>
  <OptionsSection title="Page properties">
    <div>
      <UIInputLabel for="page-title-input">
        Page title
      </UIInputLabel>
      <UIInput id="page-title-input" v-model="title" class="max-w-full w-full" />
    </div>
  </OptionsSection>
  <UISeparator />
</template>
