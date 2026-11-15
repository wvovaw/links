<script setup lang="ts">
import type { BlockProperty } from "@links/blocks";

import { UIButton, UIInput, UIInputLabel } from "@links/ui";
import { PublicApi } from "~shared/api/backend";
import { i18nLabel } from "~shared/lib/i18n-label";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
  /** The block on the page it sits in. A preview has no page to write to, so its form cannot submit. */
  blockId?: string;
}>();

const i18n = useI18n();
const route = useRoute();

/** The public page's route names its slug `link`: the same address the visitor is reading. */
const slug = computed(() => {
  const link = (route.params as Record<string, string | string[] | undefined>).link;

  return typeof link === "string" ? link : "";
});

/** Stored JSON is unvalidated, so a value that is not a string is not a text either. */
function storedText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** A property the owner never touched stores no value, so the schema's default is what the page shows. */
function textOf(name: string, fallback: string): string {
  const property = props.properties[name];
  return storedText(property?.value) || storedText(property?.defaultValue) || fallback;
}

const title = computed(() => textOf("title", ""));
const placeholder = computed(() => textOf("placeholder", "Your email"));
const buttonLabel = computed(() => textOf("button-label", "Subscribe"));
const successMessage = computed(() => textOf("success-message", "Thank you, your address is saved"));

const emailLabel = computed(() => i18nLabel(i18n, "blocks.EmailCapture.email", "Email (required)"));

const form = reactive({ email: "", company: "" });

const sending = ref(false);
const sent = ref(false);
const error = ref("");

const canSubmit = computed(() => Boolean(slug.value && props.blockId) && !sending.value);

const emailId = computed(() => `${props.blockId ?? "preview"}-email`);

async function onSubmit() {
  const blockId = props.blockId;
  if (!slug.value || !blockId) return;

  sending.value = true;
  error.value = "";

  try {
    await PublicApi.submitForm({
      slug: slug.value,
      blockId,
      kind: "subscribe",
      email: form.email,
      company: form.company,
    });

    sent.value = true;
  } catch (cause: unknown) {
    error.value =
      PublicApi.submissionStatus(cause) === 429
        ? i18nLabel(
            i18n,
            "blocks.EmailCapture.tooMany",
            "This page has taken too many addresses. Try again in a minute.",
          )
        : i18nLabel(i18n, "blocks.EmailCapture.error", "Your address could not be saved. Please try again.");
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div class="email-capture-block">
    <h3 v-if="title" class="email-capture-block__title">{{ title }}</h3>

    <p v-if="sent" class="email-capture-block__success" role="status">{{ successMessage }}</p>
    <form v-else class="email-capture-block__form" @submit.prevent="onSubmit">
      <!--
        The honeypot: off-screen and out of the tab order, so only a script that fills every input sees it.
        It is `company`, not `website`, because password managers autofill the latter.
      -->
      <input
        v-model="form.company"
        class="email-capture-block__trap"
        type="text"
        name="company"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
      />

      <div class="email-capture-block__field">
        <UIInputLabel :for="emailId">{{ emailLabel }}</UIInputLabel>
        <UIInput :id="emailId" v-model="form.email" type="email" :placeholder="placeholder" required full-width />
      </div>

      <UIButton type="submit" full-width :loading="sending" :disabled="!canSubmit">
        {{ buttonLabel }}
      </UIButton>

      <p v-if="error" class="email-capture-block__error text-chichi" role="alert">{{ error }}</p>
    </form>
  </div>
</template>

<style>
.email-capture-block {
  width: 100%;
  padding-inline: var(--links-theme-paragraph-inline-padding);
  color: var(--links-theme-paragraph-fg);
}
.email-capture-block__title {
  font-size: var(--links-theme-paragraph-font-size-lg);
  font-weight: 600;
  text-align: center;
}
.email-capture-block__form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.email-capture-block__success {
  text-align: center;
  text-wrap: balance;
}
.email-capture-block__error {
  font-size: var(--links-theme-paragraph-font-size-sm);
  text-align: center;
}
.email-capture-block__trap {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
</style>
