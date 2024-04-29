import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { AccountApi } from "~shared/api/appwrite";
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

  async function populate() {
    const session = await AccountApi.getCurrentSession();
    const user = await AccountApi.getCurrentUser();
    if (session)
      setSession(session);
    if (user)
      setUser(user);
  }
  if (import.meta.client)
    populate();

  return {
    isLogedIn,
    session,
    user,
    setSession,
    setUser,
  };
});
