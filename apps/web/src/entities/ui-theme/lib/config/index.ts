export const themeVariants = {
  auto: "auto",
  dark: "dark",
  light: "light",
} as const;
export type ThemeVariant = keyof typeof themeVariants;

export interface ITheme {
  theme: ThemeVariant;
}

/*
  icons is safelisted in uno.config.ts
*/
export const THEME_CONFIG = {
  config: {
    auto: {
      icon: "i-lucide:monitor",
    },
    dark: {
      icon: "i-lucide:moon",
    },
    light: {
      icon: "i-lucide:sun-medium",
    },
  },
  defaultValue: (): ITheme => ({ theme: "auto" }),
  cookieKey: "ui-theme",
} as const;
