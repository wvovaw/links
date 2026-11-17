import type { Composer } from "vue-i18n";

/**
 * A chrome label of the public page, read from the locale files. The key carries both languages, but a
 * locale that lost it must still render the English text the key was added for rather than an empty
 * label, so the fallback is part of every call.
 */
export function i18nLabel(i18n: Pick<Composer, "t" | "te">, key: string, fallback: string): string {
  return i18n.te(key) ? i18n.t(key) : fallback;
}
