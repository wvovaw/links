import type { InjectionKey } from "vue";

interface ConstructorData {
  isMobile: Ref<boolean>;
}
export const CONSTRUCTOR_INJECTION_KEY = Symbol("CONSTRUCTOR_INJECTION_KEY") as InjectionKey<ConstructorData>;

export function useConstructorData() {
  const data = inject(CONSTRUCTOR_INJECTION_KEY);
  if (!data)
    throw new Error("this composible must be called within MultilinksConstructor only!");
  else return data;
}
