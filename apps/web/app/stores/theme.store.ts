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
  });

  const { state, next } = useCycleList([...Object.values(modes)], {
    initialValue: mode,
  });

  const cookie = useCookie<{ theme: string }>("theme", {
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
