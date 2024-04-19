import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Session } from "~shared/api/appwrite";

export const useSessionStore = defineStore("session", () => {
  const session = ref<Session | null>(null);

  const isLogedIn = computed(() => Boolean(session.value));

  function login(sessionData: Session) {
    session.value = sessionData;
  }

  return {
    isLogedIn,
    session,
    login,
  };
});
