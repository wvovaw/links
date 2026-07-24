import { SessionModel } from "~entities/session";
import { SessionApi } from "~shared/api/backend";

export function useAuth() {
  const sessionStore = SessionModel.useSessionStore();

  async function register({ email, username, password }: SessionApi.IUserRegisterData) {
    await SessionApi.register({ email, username, password });
  }

  async function login({ email, password }: SessionApi.IUserLoginData) {
    const user = await SessionApi.login({ email, password });
    if (user) {
      sessionStore.setUser(user);
    }
  }

  async function logout() {
    await SessionApi.logout();
    sessionStore.setUser(null);
  }

  async function loadCurrentSession() {
    const user = await SessionApi.getCurrentSession();
    sessionStore.setUser(user);
  }

  return {
    register,
    login,
    logout,
    loadCurrentSession,
  };
}
