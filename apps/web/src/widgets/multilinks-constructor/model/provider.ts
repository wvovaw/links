import type { InjectionKey } from "vue";

export type PanelViewId = "blocks" | "page" | "theme";

interface ConstructorData {
  isMobile: Ref<boolean>;
  /** Switches the properties panel without asking to see it: only the toolbar opens it. */
  selectView: (view: PanelViewId) => void;
}
export const CONSTRUCTOR_INJECTION_KEY = Symbol("CONSTRUCTOR_INJECTION_KEY") as InjectionKey<ConstructorData>;

export function useConstructorData() {
  const data = inject(CONSTRUCTOR_INJECTION_KEY);
  if (!data) throw new Error("this composible must be called within MultilinksConstructor only!");
  else return data;
}
