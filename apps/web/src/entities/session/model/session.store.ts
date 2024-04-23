import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Session, User } from "~shared/api/appwrite";

export const useSessionStore = defineStore("session", () => {
  const session = ref<Session | null>(null);
  const user = ref<User | null>(null);

  const isLogedIn = computed(() => Boolean(session.value));

  function setSession(sessionData: Session | null) {
    session.value = sessionData;
  }

  function setUser(userData: User | null) {
    user.value = userData;
  }

  return {
    isLogedIn,
    session,
    user,
    setSession,
    setUser,
  };
});
