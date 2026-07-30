import type { User } from "~shared/api/backend";

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { SessionApi } from "~shared/api/backend";

export const useSessionStore = defineStore("session", () => {
  /* State */
  const user = ref<User | null>(null);

  /* Getters */
  const isLogedIn = computed(() => Boolean(user.value));

  /* Actions */
  function setUser(userData: User | null) {
    user.value = userData;
  }
  async function refreshUserData() {
    const userData = await SessionApi.getCurrentSession();
    if (userData) setUser(userData);
    else setUser(null);
  }

  return {
    isLogedIn,
    user,
    setUser,
    refreshUserData,
  };
});
