import type { ThemeVariant } from "../config";
import { THEME_CONFIG } from "../config";

export function getThemeIcon(theme: ThemeVariant): string {
  return THEME_CONFIG.config[theme].icon;
}
