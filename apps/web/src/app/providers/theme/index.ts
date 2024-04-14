import { inject } from "vue";
import type { InjectionKey } from "vue";

export const THEME_PROVIDER_KEY = Symbol("THEME_PROVIDER_KEY") as InjectionKey<string>;

export function useAppTheme() {
  const theme = inject(THEME_PROVIDER_KEY);

  if (!theme)
    throw new Error(`THEME_PROVIDER context is not available.`);

  return theme;
}
