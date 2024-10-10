import { defineStore } from "pinia";
import { useColorMode, useCycleList } from "@vueuse/core";
import { type ITheme, THEME_CONFIG, themeVariants } from "../lib/config";

export const useThemeStore = defineStore("ui-theme", () => {
  const modes = { ...themeVariants };

  const mode = useColorMode({
    emitAuto: true,
    modes,
    selector: "html",
    attribute: "data-theme",
  });

  const { state, next } = useCycleList(Object.values(modes), {
    initialValue: mode,
  });

  const cookie = useCookie<ITheme>(THEME_CONFIG.cookieKey, {
    watch: true,
  });
  if (cookie.value)
    state.value = cookie.value.theme;

  function cycle() {
    next();
    cookie.value.theme = state.value;
    state.value = cookie.value.theme;
  }

  watchEffect(() => {
    mode.value = state.value as any;
  });

  return {
    modes: Object.values(modes),
    state,
    cycle,
  };
});
