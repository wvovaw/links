<script setup lang="ts">
import type { BlockProperty, IBlockPropertySelectMultiple } from "@links/blocks";

import { UIButton, UIInput, UIInputLabel, UITextArea } from "@links/ui";
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

/**
 * The optional fields the page asked for. The address is not one of them: every submission needs one, so
 * the form always asks for it — the owner needs it to answer, and the API refuses a submission without it.
 */
const shownFields = computed<string[]>(() => {
  const property = props.properties.fields as IBlockPropertySelectMultiple | undefined;
  const selected = Array.isArray(property?.value)
    ? property.value
    : Array.isArray(property?.defaultValue)
      ? property.defaultValue
      : [];

  return (property?.options ?? []).filter((option) => selected.includes(option.value)).map((option) => option.value);
});

const showsName = computed(() => shownFields.value.includes("name"));
const showsMessage = computed(() => shownFields.value.includes("message"));

/** The label a field was configured with. These are the schema's own English labels, like every block's. */
function labelOf(field: string): string {
  const property = props.properties.fields as IBlockPropertySelectMultiple | undefined;
  return property?.options?.find((option) => option.value === field)?.label ?? field;
}

const title = computed(() => textOf("title", ""));
const description = computed(() => textOf("description", ""));
const buttonLabel = computed(() => textOf("button-label", "Send"));
const successMessage = computed(() => textOf("success-message", "Thank you, we will get back to you"));

const emailLabel = computed(() => i18nLabel(i18n, "blocks.ContactForm.email", "Email (required)"));

const form = reactive({ name: "", email: "", message: "", company: "" });

const sending = ref(false);
const sent = ref(false);
const error = ref("");

/** A preview has no slug and no page to write to, so its form does not pretend it could store anything. */
const canSubmit = computed(() => Boolean(slug.value && props.blockId) && !sending.value);

const idPrefix = computed(() => props.blockId ?? "preview");

async function onSubmit() {
  const blockId = props.blockId;
  if (!slug.value || !blockId) return;

  sending.value = true;
  error.value = "";

  try {
    await PublicApi.submitForm({
      slug: slug.value,
      blockId,
      kind: "contact",
      email: form.email,
      ...(showsName.value && { name: form.name }),
      ...(showsMessage.value && { message: form.message }),
      company: form.company,
    });

    sent.value = true;
  } catch (cause: unknown) {
    error.value =
      PublicApi.submissionStatus(cause) === 429
        ? i18nLabel(i18n, "blocks.ContactForm.tooMany", "This page has taken too many messages. Try again in a minute.")
        : i18nLabel(i18n, "blocks.ContactForm.error", "Your message could not be saved. Please try again.");
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div class="contact-form-block">
    <h3 v-if="title" class="contact-form-block__title">{{ title }}</h3>
    <p v-if="description" class="contact-form-block__description">{{ description }}</p>

    <p v-if="sent" class="contact-form-block__success" role="status">{{ successMessage }}</p>
    <form v-else class="contact-form-block__form" @submit.prevent="onSubmit">
      <!--
        The honeypot. It is off-screen and out of the tab order, so nobody filling this form by hand reaches
        it; a script that fills every input it finds is answered as if the message had been stored. The name
        is `company` rather than `website` because password managers autofill the latter, which would throw a
        real visitor's message away while thanking them for it.
      -->
      <input
        v-model="form.company"
        class="contact-form-block__trap"
        type="text"
        name="company"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
      />

      <div v-if="showsName" class="contact-form-block__field">
        <UIInputLabel :for="`${idPrefix}-name`">{{ labelOf("name") }}</UIInputLabel>
        <UIInput :id="`${idPrefix}-name`" v-model="form.name" type="text" full-width />
      </div>

      <div class="contact-form-block__field">
        <UIInputLabel :for="`${idPrefix}-email`">{{ emailLabel }}</UIInputLabel>
        <UIInput :id="`${idPrefix}-email`" v-model="form.email" type="email" required full-width />
      </div>

      <div v-if="showsMessage" class="contact-form-block__field">
        <UIInputLabel :for="`${idPrefix}-message`">{{ labelOf("message") }}</UIInputLabel>
        <UITextArea :id="`${idPrefix}-message`" v-model="form.message" :rows="3" resize="vertical" />
      </div>

      <UIButton type="submit" full-width :loading="sending" :disabled="!canSubmit">
        {{ buttonLabel }}
      </UIButton>

      <p v-if="error" class="contact-form-block__error text-chichi" role="alert">{{ error }}</p>
    </form>
  </div>
</template>

<style>
.contact-form-block {
  width: 100%;
  padding-inline: var(--links-theme-paragraph-inline-padding);
  color: var(--links-theme-paragraph-fg);
}
.contact-form-block__title {
  font-size: var(--links-theme-paragraph-font-size-lg);
  font-weight: 600;
  text-align: center;
}
.contact-form-block__description {
  margin-block: 0.25rem 0.75rem;
  text-align: center;
  text-wrap: balance;
}
.contact-form-block__form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.contact-form-block__success {
  text-align: center;
  text-wrap: balance;
}
.contact-form-block__error {
  font-size: var(--links-theme-paragraph-font-size-sm);
  text-align: center;
}
/* Both traps: out of sight, out of the layout, but still an input a script will fill in. */
.contact-form-block__trap {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
</style>
