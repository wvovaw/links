import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { AccountApi } from "~shared/api/appwrite";
import type { Session, User } from "~shared/api/appwrite";

export const useSessionStore = defineStore("session", () => {
  /* State */
  const session = ref<Session | null>(null);
  const user = ref<User | null>(null);

  /* Getters */
  const isLogedIn = computed(() => Boolean(session.value));

  /* Actions */
  function setSession(sessionData: Session | null) {
    session.value = sessionData;
  }
  function setUser(userData: User | null) {
    user.value = userData;
  }
  async function refreshUserData() {
    const userData = await AccountApi.getCurrentUser();
    if (userData)
      setUser(userData);
  }
  async function refreshSessionData() {
    const session = await AccountApi.getCurrentSession();
    if (session)
      setSession(session);
  }

  /* Setup */
  if (import.meta.client) {
    refreshSessionData();
    refreshUserData();
  }

  return {
    isLogedIn,
    session,
    user,
    setSession,
    setUser,
    refreshUserData,
    refreshSessionData,
  };
});
