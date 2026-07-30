import { SessionModel } from "~entities/session";

export default defineNuxtPlugin(async () => {
  const sessionStore = SessionModel.useSessionStore();

  if (sessionStore.user) return;

  try {
    await sessionStore.refreshUserData();
  } catch {
    sessionStore.setUser(null);
  }
});
