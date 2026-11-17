<script setup lang="ts">
import type { PageTheme } from "@links/blocks";

import { BACKGROUND_PRESETS, BUTTON_VARIANTS, COLOR_SCHEMES, DEFAULT_PAGE_THEME, FONT_PRESETS } from "@links/blocks";
import { UIInput, UIInputLabel, UISelect, UISlider, UITag } from "@links/ui";

import { useConstructorStore } from "../../model";

const constructorStore = useConstructorStore();
const { theme } = storeToRefs(constructorStore);
const { setTheme } = constructorStore;

/** A page without a stored theme shows the default one; the first edit makes that theme real. */
const shownTheme = computed(() => theme.value ?? DEFAULT_PAGE_THEME);

const fontLabels: Record<PageTheme["fontPreset"], string> = {
  "dm-sans": "DM Sans",
  "system": "System",
};

function setOverlay(value: number[]) {
  setTheme({ overlayOpacity: value[0] ?? 0 });
}

function setRadius(value: number[]) {
  setTheme({ radius: value[0] ?? 0 });
}

function setFont(value: string | number) {
  setTheme({ fontPreset: String(value) as PageTheme["fontPreset"] });
}

function setButtonVariant(value: string | number) {
  setTheme({ buttonVariant: String(value) as PageTheme["buttonVariant"] });
}

function setColorScheme(value: string | number) {
  setTheme({ colorScheme: String(value) as PageTheme["colorScheme"] });
}
</script>

<template>
  <div class="flex flex-col gap-6 p-4 pb-10">
    <section>
      <h3 class="pb-2 text-trunks font-semibold">Background</h3>
      <div class="flex flex-wrap justify-around gap-4">
        <div
          v-for="(preset, id) of BACKGROUND_PRESETS"
          :key="id"
          class="relative aspect-3/5 w-22 cursor-pointer border-(1 beerus) rounded-moon-i-sm transition-colors duration-300 hover:(border-bulma)"
          :class="{ 'border-bulma': shownTheme.backgroundPreset === id }"
          :style="preset"
          @click="setTheme({ backgroundPreset: id })"
        >
          <UITag class="absolute bottom-1 right-1">
            {{ id }}
          </UITag>
        </div>
      </div>
    </section>

    <section>
      <UIInputLabel> Scrim opacity </UIInputLabel>
      <UISlider
        aria-label="Scrim opacity"
        :model-value="[shownTheme.overlayOpacity]"
        :min="0"
        :max="1"
        :step="0.05"
        @update:model-value="setOverlay"
      />
    </section>

    <section>
      <UIInputLabel> Corner radius </UIInputLabel>
      <UISlider
        aria-label="Corner radius"
        :model-value="[shownTheme.radius]"
        :min="0"
        :max="40"
        :step="1"
        @update:model-value="setRadius"
      />
    </section>

    <section>
      <UIInputLabel for="theme-accent-input"> Accent colour </UIInputLabel>
      <div class="flex flex-row gap-1">
        <input
          class="theme-editor__color"
          type="color"
          aria-label="Accent colour"
          :value="shownTheme.accent"
          @input="(event) => setTheme({ accent: (event.target as HTMLInputElement).value })"
        />
        <UIInput
          id="theme-accent-input"
          :model-value="shownTheme.accent"
          full-width
          @update:model-value="(value) => setTheme({ accent: String(value) })"
        />
      </div>
    </section>

    <section>
      <UIInputLabel for="theme-text-input"> Text colour </UIInputLabel>
      <div class="flex flex-row gap-1">
        <input
          class="theme-editor__color"
          type="color"
          aria-label="Text colour"
          :value="shownTheme.text"
          @input="(event) => setTheme({ text: (event.target as HTMLInputElement).value })"
        />
        <UIInput
          id="theme-text-input"
          :model-value="shownTheme.text"
          full-width
          @update:model-value="(value) => setTheme({ text: String(value) })"
        />
      </div>
    </section>

    <section>
      <UIInputLabel> Font </UIInputLabel>
      <UISelect aria-label="Font" :model-value="shownTheme.fontPreset" @update:model-value="setFont">
        <option v-for="preset of FONT_PRESETS" :key="preset" :value="preset">
          {{ fontLabels[preset] }}
        </option>
      </UISelect>
    </section>

    <section>
      <UIInputLabel> Button style </UIInputLabel>
      <UISelect
        aria-label="Button style"
        :model-value="shownTheme.buttonVariant"
        @update:model-value="setButtonVariant"
      >
        <option v-for="variant of BUTTON_VARIANTS" :key="variant" :value="variant">
          {{ variant }}
        </option>
      </UISelect>
    </section>

    <section>
      <UIInputLabel> Colour scheme </UIInputLabel>
      <UISelect aria-label="Colour scheme" :model-value="shownTheme.colorScheme" @update:model-value="setColorScheme">
        <option v-for="scheme of COLOR_SCHEMES" :key="scheme" :value="scheme">
          {{ scheme }}
        </option>
      </UISelect>
    </section>
  </div>
</template>

<style scoped>
.theme-editor__color {
  appearance: none;
  background: none;
  border: 1px solid var(--beerus);
  border-radius: var(--radius-i-sm);
  cursor: pointer;
  height: 100%;
  aspect-ratio: 1/1;
  overflow: hidden;
}
.theme-editor__color::-webkit-color-swatch-wrapper {
  padding: 0;
}
.theme-editor__color::-webkit-color-swatch {
  border: 0;
}
.theme-editor__color::-moz-color-swatch {
  border: 0;
}
</style>
