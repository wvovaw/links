import { defineStore } from "pinia";
import { useColorMode, useCycleList } from "@vueuse/core";

export const useThemeStore = defineStore("themeStore", () => {
  const modes = {
    auto: "auto",
    light: "light",
    dark: "dark",
  };

  const mode = useColorMode({
    emitAuto: true,
    modes,
    selector: "html",
    attribute: "data-theme",
    storageKey: "theme",
  });

  const { state, next } = useCycleList(Object.values(modes), {
    initialValue: mode,
  });

  const cookie = useCookie<{ theme: string }>("theme", {
    watch: true,
  });
  if (cookie.value)
    state.value = cookie.value.theme;
  else
    state.value = localStorage.getItem("theme") || "auto";

  function cycle() {
    next();
    if (cookie.value)
      cookie.value.theme = state.value;
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
