import { SessionModel } from "~entities/session";
import { AccountApi  } from "~shared/api/appwrite";

export function useAuth() {
  const sessionStore = SessionModel.useSessionStore();

  async function register({ email, username, password }: AccountApi.IUserRegisterData) {
    await AccountApi.register({ email, username, password });
  }

  async function login({ email, password }: AccountApi.IUserLoginData) {
    const session = await AccountApi.login({ email, password });
    if (session) {
      sessionStore.setSession(session);
      await loadSessionUser();
    }
  }

  function logout() {
    AccountApi.logout();
    sessionStore.setUser(null);
    sessionStore.setSession(null);
  }

  async function loadSessionUser() {
    const user = await AccountApi.getCurrentUser();
    if (user)
      sessionStore.setUser(user);
  }

  async function loadCurrentSession() {
    const session = await AccountApi.getCurrentSession();
    if (session)
      sessionStore.setSession(session);
  }

  return {
    register,
    login,
    logout,
    loadSessionUser,
    loadCurrentSession,
  };
}
