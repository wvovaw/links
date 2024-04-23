import { SessionApi, SessionModel } from "~entities/session";

export function useAuth() {
  const sessionStore = SessionModel.useSessionStore();

  async function register({ email, username, password }: SessionApi.IUserRegisterData) {
    await SessionApi.register({ email, username, password });
  }

  async function login({ email, password }: SessionApi.IUserLoginData) {
    const session = await SessionApi.login({ email, password });
    if (session) {
      sessionStore.login(session);
      await loadSessionUser();
    }
  }

  function logout() {
    SessionApi.logout();
    sessionStore.logout();
  }

  async function loadSessionUser() {
    const data = await SessionApi.getCurrentUser();
    if (data)
      sessionStore.setUser(data);
  }

  return {
    register,
    login,
    logout,
  };
}
