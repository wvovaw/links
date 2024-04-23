import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Session, User } from "~shared/api/appwrite";

export const useSessionStore = defineStore("session", () => {
  const session = ref<Session | null>(null);
  const user = ref<User | null>(null);

  const isLogedIn = computed(() => Boolean(session.value));

  function login(sessionData: Session) {
    session.value = sessionData;
  }

  function logout() {
    session.value = null;
  }

  function setUser(userData: User) {
    user.value = userData;
  }

  return {
    isLogedIn,
    session,
    user,
    login,
    logout,
    setUser,
  };
});
