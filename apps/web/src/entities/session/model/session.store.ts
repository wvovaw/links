import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useSessionStore = defineStore("session", () => {
  const sessionToken = ref<string | null>(null);

  const isLogedIn = computed(() => Boolean(sessionToken.value));

  function login(id: string) {
    sessionToken.value = id;
  }

  return {
    isLogedIn,
    sessionToken,
    login
  };
});
