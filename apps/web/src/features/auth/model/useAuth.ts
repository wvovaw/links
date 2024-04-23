import { SessionApi, SessionModel } from "~entities/session";

export function useAuth() {
  const sessionStore = SessionModel.useSessionStore();

  async function register({ email, username, password }: SessionApi.IUserRegisterData) {
    await SessionApi.register({ email, username, password });
  }

  async function login({ email, password }: SessionApi.IUserLoginData) {
    const session = await SessionApi.login({ email, password });
    if (session) {
      sessionStore.setSession(session);
      await loadSessionUser();
    }
  }

  function logout() {
    SessionApi.logout();
    sessionStore.setUser(null);
    sessionStore.setSession(null);
  }

  async function loadSessionUser() {
    const user = await SessionApi.getCurrentUser();
    if (user)
      sessionStore.setUser(user);
  }

  async function loadCurrentSession() {
    const session = await SessionApi.getCurrentSession();
    if (session)
      sessionStore.setSession(session);
  }

  return {
    register,
    login,
    logout,
    loadSessionUser,
    loadCurrentSession
  };
}
